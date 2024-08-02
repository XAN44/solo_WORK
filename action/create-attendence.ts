"use server";

import { Attendance } from "@prisma/client";
import { db } from "../src/lib/db";
import {
  format,
  isBefore,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
} from "date-fns";
import { sendMailWithTimeIn } from "../src/lib/sendMail_TimeIn";
import { GetAdminInTeam, GetTeamById } from "../data/team";
import { auth } from "../auth";
import { getUserById } from "../data/user";
import { GetSupervisorById } from "../data/supervisor";
import { sendMailWithTimeInSupervisor } from "../src/lib/sendMail_SupervisorTimeIn";
import { enUS } from "date-fns/locale";

export async function createAttendence(teamMemberId: string, dateIn: Date) {
  const user = await auth();
  const today = new Date();

  const nineAm = setHours(
    setMinutes(setSeconds(setMilliseconds(today, 0), 0), 0),
    9,
  );
  // TODO ถ้าลงชื่อหลังจาก 9:00 ถือว่ามาสาย
  const type = dateIn > nineAm ? Attendance.Late : Attendance.Present;

  await db.attendance.create({
    data: {
      teamMemberId,
      dateIn,
      type,
    },
  });
  const [userData, teamData, adminEmail] = await Promise.all([
    getUserById(user?.user.id || ""),
    GetTeamById(user?.user.id || ""),
    GetAdminInTeam(user?.user.id || ""),
  ]);

  // ส่งอีเมลไปยังแอดมิน
  if (adminEmail) {
    await sendMailWithTimeIn(
      adminEmail,
      userData?.role || "",
      userData?.job || "",
      userData?.first_name || "",
      userData?.last_name || "",
      userData?.department || "",
      dateIn,
    );
  }

  return;
}
