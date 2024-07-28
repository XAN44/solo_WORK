"use server";

import { z } from "zod";
import { StartLeaveRequest } from "../schema/validateLeaveRequest";
import { differenceInDays } from "date-fns";
import { db } from "../src/lib/db";
import { auth } from "../auth";
import { ApprovalStatus, Attendance, TypeLeave } from "@prisma/client";
import { GetSupervisorById } from "../data/supervisor";
import { useId } from "react";
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
    return {
      error: "",
    };
  }

  const { title, reason, dateIn, dateOut, tel, typeLeave } = validate.data;

  const now = new Date();

  // TODO : ควบคุมการลา โดยต้องลาล่วงหน้า 15 วัน
  const dayDifference = differenceInDays(new Date(dateIn), now);

  //   TODO : วันสิ้นสุดการลา ไม่ควรน้อยกว่าวันที่เริ่มลา
  if (new Date(dateOut) < new Date(dateIn)) {
    return { error: "วันสิ้นสุดการลา ไม่ควรน้อยกว่าวันเริ่มลา" };
  }
  //   TODO : ตรวจสอบว่าได้ดำเนินการลาล่วงหน้าแล้วหรือยัง
  // if (dayDifference <= 14) {
  //   return { error: "Leave must be requested at least 15 days in advance" };
  // }
  const leaveDuration =
    differenceInDays(new Date(dateOut), new Date(dateIn)) + 1; // รวมวันที่เริ่มต้นและวันสิ้นสุด

  const create = await db.attendance.create({
    data: {
      title,
      userId,
      typeleave: typeLeave,
      reason,
      type: Attendance.Leave,
      statusLeave: ApprovalStatus.PENDING,
      tel,
      dateIn,
      dateOut,
    },
  });

  const supervisor = await GetSupervisorById(user?.user.id || "");
  const userData = await getUserById(user?.user.id || "");
  const team = await GetTeamById(user?.user.id || "");

  await sendWithLeaveRequest(
    create.id,
    create.title || "",
    supervisor?.supervisor?.email || "",
    userData?.first_name || "",
    userData?.last_name || "",
    userData?.username || "",
    team?.team?.department || "",
    supervisor?.supervisor?.username || "",
    typeLeave,
    tel,
    reason,
    dateIn,
    dateOut,
    create.statusLeave || "",
    leaveDuration,
  );

  return {
    success: `The system will send an email to the supervisor. ${supervisor?.supervisor?.username}  `,
    successId: create.id,
  };
};
