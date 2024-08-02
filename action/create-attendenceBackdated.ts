"use server";

import { Attendance } from "@prisma/client";
import { db } from "../src/lib/db";
import {
  isBefore,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  startOfDay,
} from "date-fns";
import { sendMailWithTimeInSupervisor } from "../src/lib/sendMail_SupervisorTimeIn";
import { auth } from "../auth";
import { getUserById } from "../data/user";
import { GetAdminInTeam, GetTeamById } from "../data/team";
import { GetSupervisorById } from "../data/supervisor";

export async function createAttendenceBackDated(
  teamMemberId: string,
  dateIn: Date,
  dateOut: Date,
) {
  const user = await auth();
  const today = new Date();

  // กำหนดเวลา 9:00 AM
  const nineAm = setHours(
    setMinutes(setSeconds(setMilliseconds(today, 0), 0), 0),
    9,
  );

  // ประเภทการเข้าทำงาน
  const type = isBefore(dateIn, nineAm) ? Attendance.Late : Attendance.Present;

  // ประเภทการลงชื่อย้อนหลัง
  const attendanceType = isBefore(dateIn, startOfDay(today))
    ? Attendance.Backdate
    : type;

  // สร้างข้อมูลการเข้าทำงาน
  if (dateOut && isBefore(dateIn, startOfDay(today))) {
    await db.attendance.create({
      data: {
        teamMemberId,
        dateIn,
        dateOut,
        type: attendanceType,
      },
    });
  }

  // ดึงข้อมูลผู้ใช้, ทีม, ซูเปอร์ไวเซอร์, และแอดมินพร้อมกัน
  const [userData, teamData, , adminEmail] = await Promise.all([
    getUserById(user?.user.id || ""),
    GetTeamById(user?.user.id || ""),
    db.teamMember.findUnique({
      where: { id: teamMemberId },
      select: { isSupervisor: true },
    }),
    GetAdminInTeam(user?.user.id || ""),
    GetSupervisorById(user?.user.id || ""),
  ]);

  // ส่งอีเมล
  if (adminEmail) {
    await sendMailWithTimeInSupervisor(
      adminEmail,
      userData?.role || "",
      userData?.job || "",
      userData?.first_name || "",
      userData?.last_name || "",
      userData?.department || "",
      teamData?.project || "",
      dateIn,
      dateOut || null, // ใช้ null ถ้า dateOut ไม่มีค่า
      attendanceType,
    );
  }

  return;
}
