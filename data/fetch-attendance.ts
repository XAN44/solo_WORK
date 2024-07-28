"use server";

import { db } from "../src/lib/db";

export async function getAttendance(userId: string) {
  const data = await db.attendance.findMany({
    where: {
      userId,
    },
  });
  return data;
}

export async function getAttendanceForSumery(userId: string) {
  const data = await db.attendance.findMany({
    where: {
      userId,
    },
    select: {
      dateIn: true,
      dateOut: true,
      type: true,
    },
  });
  return data;
}

export async function getAttendanceByIdAndDate(userId: string, checkIn: Date) {
  const startOfDay = new Date(checkIn.setHours(0, 0, 0, 0));
  const endOfDay = new Date(checkIn.setHours(23, 59, 59, 999));

  const data = await db.attendance.findMany({
    where: {
      userId,
      dateIn: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });
  return data;
}
