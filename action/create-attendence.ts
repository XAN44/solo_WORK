"use server";

import { Attendance } from "@prisma/client";
import { db } from "../src/lib/db";
import { setHours, setMilliseconds, setMinutes, setSeconds } from "date-fns";

export async function createAttendence(teamMemberId: string, dateIn: Date) {
  // TODO : ลงชือเป็นช่วงเวลาล่าสุด

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

  console.log(data);
  return;
}
