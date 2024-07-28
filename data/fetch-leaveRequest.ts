"use server";

import { endOfDay, startOfDay } from "date-fns";
import { db } from "../src/lib/db";
import { Attendance } from "@prisma/client";

export async function getLeaveRequestByDate(userId: string, checkDate: Date) {
  const startOfDayDate = startOfDay(checkDate);
  const endOfDayDate = endOfDay(checkDate);
  const leaveRequest = await db.attendance.findMany({
    where: {
      userId: userId,

      type: Attendance.Leave,
    },
  });

  return leaveRequest;
}
