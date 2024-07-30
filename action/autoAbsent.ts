"use server";
import {
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
  isAfter,
  endOfDay,
} from "date-fns";
import { db } from "../src/lib/db";
import { Attendance, ApprovalStatus } from "@prisma/client";

// Flag to prevent duplicate runs
let isRunning = false;

export async function markAbsentUsers() {
  if (isRunning) {
    console.log("markAbsentUsers is already running.");
    return;
  }

  isRunning = true;

  try {
    // ตรวจสอบเวลาปัจจุบัน
    const now = new Date();
    const targetHour = 17;
    const targetMinutes = 10;

    // กำหนดเวลาที่ต้องการทำการเช็ค
    const targetTime = setSeconds(
      setMinutes(setHours(startOfDay(now), targetHour), targetMinutes),
      0,
    );

    // ตรวจสอบว่าเวลาปัจจุบันตรงกับเวลาที่ต้องการหรือไม่
    if (now.getHours() !== targetHour || now.getMinutes() !== targetMinutes) {
      console.log("Not the time to mark absent users.");
      isRunning = false;
      return;
    }

    // ตรวจสอบว่าเวลาปัจจุบันมากกว่ากำหนดเวลา
    if (!isAfter(now, targetTime)) {
      console.log("Not the time to mark absent users.");
      isRunning = false;
      return;
    }

    // ดึงข้อมูลผู้ใช้ทั้งหมด
    const users = await db.user.findMany();
    console.log("Users found:", users.length);

    for (const user of users) {
      // ตรวจสอบว่ามีการเช็คชื่อ (Check-In) ในวันปัจจุบันหรือไม่
      const existingCheckIn = await db.attendance.findFirst({
        where: {
          teamMemberId: user.id,
          dateIn: {
            gte: startOfDay(now),
            lte: endOfDay(now),
          },
        },
      });

      // ถ้ามีการเช็คชื่อแล้วในวันปัจจุบัน ให้ข้ามไป
      if (existingCheckIn) {
        console.log(`User ${user.username} has already checked in today.`);
        continue;
      }

      // ตรวจสอบว่าผู้ใช้ได้ลางานในวันนั้นหรือไม่และสถานะการลาเป็น APPROVED หรือไม่
      const leave = await db.attendance.findFirst({
        where: {
          teamMemberId: user.id,
          type: Attendance.Leave,
          dateIn: {
            lte: endOfDay(now),
          },
          dateOut: {
            gte: startOfDay(now),
          },
          statusLeave: ApprovalStatus.APPROVED,
        },
      });

      // ถ้าผู้ใช้ได้ลางานและสถานะการลาเป็น APPROVED ให้ข้ามไป
      if (leave) {
        console.log(`User ${user.username} is on approved leave today.`);
        continue;
      }

      // ตรวจสอบว่ามีการบันทึกการขาดงานในวันปัจจุบันแล้วหรือไม่
      const existingAttendance = await db.attendance.findFirst({
        where: {
          teamMemberId: user.id,
          type: Attendance.Absent,
          dateIn: null,
          dateOut: null,
          AND: [
            {
              createAt: {
                gte: startOfDay(now),
                lte: endOfDay(now),
              },
            },
          ],
        },
      });

      // ถ้ามีการบันทึกการขาดงานแล้วในวันปัจจุบัน ให้ข้ามไป
      if (existingAttendance) {
        console.log(`User ${user.username} already marked as absent today.`);
        continue;
      }

      // ตรวจสอบว่ามี task ถูกสร้างในวันนั้นหรือไม่
      const tasks = await db.task.findMany({
        where: {
          teamMemberId: user.id,
          startAt: {
            gte: startOfDay(now),
            lte: endOfDay(now),
          },
        },
      });

      // ถ้าไม่มี task และเวลาปัจจุบันมากกว่ากำหนดเวลา
      if (tasks.length === 0 && isAfter(now, targetTime)) {
        console.log(
          `User ${user.username} was automatically marked as absent.`,
        );

        await db.attendance.create({
          data: {
            teamMemberId: user.id,
            type: Attendance.Absent,
            dateIn: now,
            dateOut: now,
          },
        });
      }
    }

    console.log("Current time:", now);
    console.log("Target time:", targetTime);
  } catch (error) {
    console.error("An error occurred while marking absent users:", error);
  } finally {
    isRunning = false;
  }
}
