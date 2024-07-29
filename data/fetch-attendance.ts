"use server";

import { db } from "../src/lib/db";

export async function getAttendance(teamMemberId: string) {
  const data = await db.attendance.findMany({
    where: {
      teamMemberId,
    },
  });
  return data;
}

export async function getAttendanceForSumery(teamMemberId: string) {
  const data = await db.attendance.findMany({
    where: {
      teamMemberId,
    },
    select: {
      dateIn: true,
      dateOut: true,
      type: true,
    },
  });
  return data;
}

export async function getAttendanceByIdAndDate(
  teamMemberId: string,
  checkIn: Date,
) {
  const startOfDay = new Date(checkIn.setHours(0, 0, 0, 0));
  const endOfDay = new Date(checkIn.setHours(23, 59, 59, 999));

  const data = await db.attendance.findMany({
    where: {
      teamMemberId,
      dateIn: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });
  return data;
}
