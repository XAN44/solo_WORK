"use server";

import { z } from "zod";
import { StartLeaveRequest } from "../schema/validateLeaveRequest";
import { differenceInDays, startOfDay } from "date-fns";
import { db } from "../src/lib/db";
import { auth } from "../auth";
import { ApprovalStatus, Attendance } from "@prisma/client";
import { getUserById } from "../data/user";
import { GetTeamById } from "../data/team";
import { sendWithLeaveRequest } from "../src/lib/sendMail_LeaveRequest";

export const StartLeaveRequestAtion = async (
  value: z.infer<typeof StartLeaveRequest>,
) => {
  const user = await auth();
  const userId = user?.user.id || "";

  const validate = StartLeaveRequest.safeParse(value);

  if (!validate.success) {
    return { error: "" };
  }

  const { title, reason, dateIn, dateOut, tel, typeLeave } = validate.data;

  const now = startOfDay(new Date());
  const dateInDate = startOfDay(new Date(dateIn));
  const dateOutDate = startOfDay(new Date(dateOut));

  // ตรวจสอบวันสิ้นสุดการลาไม่ควรน้อยกว่าวันที่เริ่มลา
  if (dateOutDate < dateInDate) {
    return {
      error:
        "The end date of the leave should not be less than the date the leave begins",
    };
  }

  // ตรวจสอบระยะเวลาในการลาล่วงหน้า
  const dayDifference = differenceInDays(dateInDate, now);
  if (dayDifference < 15) {
    const daysRemaining = 15 - dayDifference;
    return {
      error: `Leave must be requested at least 15 days in advance. You need to request leave ${daysRemaining} day(s) earlier.`,
    };
  }

  const leaveDuration = differenceInDays(dateOutDate, dateInDate) + 1; // รวมวันที่เริ่มต้นและวันสิ้นสุด

  // ดึงข้อมูลพร้อมกัน
  const [teamMember, userData, team, isSupervisor, isAdmin] = await Promise.all(
    [
      db.teamMember.findFirst({
        where: { userId },
        select: { id: true },
      }),
      getUserById(userId),
      GetTeamById(userId),
      db.teamMember.findFirst({
        where: {
          isSupervisor: true,
          team: { member: { some: { userId } } },
        },
        select: {
          isSupervisor: true,
          user: { select: { id: true, email: true } },
        },
      }),
      db.team.findFirst({
        where: { member: { some: { userId } } },
        select: { admin: { select: { email: true } } },
      }),
    ],
  );

  // สร้างข้อมูลการลา
  const create = await db.attendance.create({
    data: {
      title,
      teamMemberId: teamMember?.id,
      typeleave: typeLeave,
      reason,
      type: Attendance.Leave,
      statusLeave: ApprovalStatus.PENDING,
      tel,
      dateIn,
      dateOut,
    },
  });

  if (isAdmin?.admin?.email) {
    await sendWithLeaveRequest(
      create.id,
      create.title || "",
      isAdmin.admin.email,
      userData?.first_name || "",
      userData?.last_name || "",
      userData?.username || "",
      team?.department || "",
      typeLeave,
      tel,
      reason,
      // dateIn,
      // dateOut,
      create.statusLeave || "",
      leaveDuration,
    );
  }

  return {
    success: `Request created successfully
`,
  };
};
