"use server";

import { z } from "zod";
import { createTeamSchema } from "../schema/validateCreate_Team";
import { db } from "../src/lib/db";
import { useCurrentLevel } from "../src/lib/auth";
import { isBefore, parse, parseISO, startOfDay } from "date-fns";
import { auth } from "../auth";
import { sendEmailWhenAdminCreateTeam } from "../src/lib/sendMail_CreateTeam";

export const CreateTeamByAdmin = async (
  value: z.infer<typeof createTeamSchema>,
) => {
  const session = await useCurrentLevel();

  if (session !== "Admin") {
    return null;
  }

  const validateField = createTeamSchema.safeParse(value);

  if (!validateField.success) {
    return { error: "invalid field" };
  }

  const { department, supervisor, member, project, report, startAt, endAt } =
    validateField.data;

  try {
    // ! ถ้าเวลาจบงานสิ้นสุดก่อนวันเริ่มงาน ให้ error ออกมา
    if (endAt <= startAt) {
      return { error: "end date must be after start date  " };
    }

    const today = startOfDay(new Date());
    if (isBefore(startAt, today)) {
      return { error: "Start date cannot be in the past" };
    }

    //  TODO อัพเดทสิทธิ์ผู้ใช้เป็น supervisor
    await db.user.update({
      where: {
        id: supervisor,
      },
      data: {
        level: "Supervisor",
      },
    });
    // TODO : อัพเดท supervrisor ให้กับ member
    await db.user.updateMany({
      where: {
        id: {
          in: member.map((userId) => userId.value),
        },
      },
      data: {
        supervisorId: supervisor,
      },
    });

    // TODO : สร้างทีม
    await db.team.create({
      data: {
        department,
        project,
        startAt,
        endAt,
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
    });

    const allUser = [supervisor, ...member.map((userId) => userId.value)];
    const users = await db.user.findMany({
      where: {
        id: {
          in: allUser,
        },
      },
      select: {
        email: true,
      },
    });

    const emails = users
      .map((user) => user.email)
      .filter(
        (email): email is string => email !== null && email !== undefined,
      );

    // await sendEmailWhenAdminCreateTeam(emails);

    return {
      success: "Successfully system will send an email to the team members.",
    };
  } catch (error) {
    return null;
  }
};
