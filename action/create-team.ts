"use server";

import { z } from "zod";
import { createTeamSchema } from "../schema/validateCreate_Team";
import { db } from "../src/lib/db";
import { useCurrentLevel } from "../src/lib/auth";
import { isBefore, startOfDay } from "date-fns";
import { auth } from "../auth";
import { sendEmailWhenAdminCreateTeam } from "../src/lib/sendMail_CreateTeam";

export const CreateTeamByAdmin = async (
  value: z.infer<typeof createTeamSchema>,
) => {
  const session = await useCurrentLevel();
  const user = await auth();

  if (session !== "Admin") {
    return null;
  }

  const validateField = createTeamSchema.safeParse(value);

  if (!validateField.success) {
    return { error: "invalid field" };
  }

  const { department, supervisor, member, project, detail, startAt, endAt } =
    validateField.data;

  try {
    // ตรวจสอบวันที่
    if (endAt <= startAt) {
      return { error: "end date must be after start date" };
    }

    const today = startOfDay(new Date());
    if (isBefore(startAt, today)) {
      return { error: "Start date cannot be in the past" };
    }

    const adminId = user?.user.id;

    // อัพเดทสิทธิ์ผู้ใช้เป็น Supervisor และอัพเดท Supervisor ให้กับสมาชิก
    const [supervisorUpdate, memberUpdate, teamCreate] = await Promise.all([
      db.user.update({
        where: { id: supervisor },
        data: { level: "Supervisor" },
      }),
      db.user.updateMany({
        where: {
          id: {
            in: member.map((userId) => userId.value),
          },
        },
        data: { supervisorId: supervisor },
      }),
      db.team.create({
        data: {
          department,
          project,
          startAt,
          endAt,
          detail,
          adminId,
          member: {
            create: [
              {
                userId: supervisor,
                isSupervisor: true,
                StartAt: startAt,
                endAt: endAt,
              },
              ...member.map((userId) => ({
                userId: userId.value,
                isSupervisor: false,
                StartAt: startAt,
                endAt: endAt,
              })),
            ],
          },
        },
      }),
    ]);

    // ดึงข้อมูลผู้ใช้ที่เกี่ยวข้องทั้งหมดพร้อมกัน
    const allUser = [supervisor, ...member.map((userId) => userId.value)];
    const users = await db.user.findMany({
      where: { id: { in: allUser } },
      select: { id: true, email: true, username: true },
    });

    // ค้นหาข้อมูลที่จำเป็น
    const supervisorUser = users.find((user) => user.id === supervisor);
    const teamMembers = users.filter((user) => user.id !== supervisor);

    const emails = users
      .map((user) => user.email)
      .filter(
        (email): email is string => email !== null && email !== undefined,
      );

    // ส่งอีเมล
    await sendEmailWhenAdminCreateTeam(
      emails,
      project,
      teamMembers.map((member) => ({
        name: member.username || "Unknown",
        email: member.email || "No email",
      })),
      {
        name: supervisorUser?.username || "Unknown",
        email: supervisorUser?.email || "No email",
      },
      detail,
    );

    return {
      success: "Successfully system will send an email to the team members.",
    };
  } catch (error) {
    console.error("Error creating team:", error);
    return { error: "An error occurred while creating the team" };
  }
};
