"use server";

import { Attendance } from "@prisma/client";
import { db } from "../src/lib/db";
import { setHours, setMilliseconds, setMinutes, setSeconds } from "date-fns";
import { sendMailWithTimeIn } from "../src/lib/sendMail_TimeIn";
import { GetSupervisorById } from "../data/supervisor";
import { auth } from "../auth";
import { getUserById } from "../data/user";
import { GetTeamById } from "../data/team";

export async function createAttendence(teamMemberId: string, dateIn: Date) {
  // TODO : ลงชือเป็นช่วงเวลาล่าสุด
  const user = await auth();
  const today = new Date();

  const nineAm = setHours(
    setMinutes(setSeconds(setMilliseconds(today, 0), 0), 0),
    9,
  );
  //   TODO ถ้าหากว่าเวลาที่ลงชื่อ(สร้างงาน) มากกว่า 09:00 ให้เปลี่ยนสถานะงานเป็น late
  const type = dateIn > nineAm ? Attendance.Late : Attendance.Present;

  const data = await db.attendance.create({
    data: {
      teamMemberId,
      dateIn,
      type,
    },
  });

  const supervisor = await GetSupervisorById(user?.user.id || "");
  const userData = await getUserById(user?.user.id || "");
  const team = await GetTeamById(user?.user.id || "");

  await sendMailWithTimeIn(
    supervisor?.email || "",
    userData?.username || "",
    userData?.first_name || "",
    userData?.last_name || "",
    userData?.department || "",
    team?.project || "",
    dateIn,
  );

  console.log(data);
  return;
}
