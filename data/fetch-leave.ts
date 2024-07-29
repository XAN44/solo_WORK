"use server";

import { endOfDay, startOfDay } from "date-fns";
import { db } from "../src/lib/db"; // ปรับตามที่ตั้งของ db
import { Attendance, ApprovalStatus } from "@prisma/client";

export async function FetchAbsentMember() {
  const now = new Date();

  // ดึงข้อมูลสมาชิกทีมทั้งหมดที่ไม่มีการลงชื่อและไม่มีการสร้างงานในวันนี้
  const teamMembers = await db.teamMember.findMany({
    include: {
      user: true, // ดึงข้อมูล user ของสมาชิกทีมเพื่อให้ได้ชื่อ
      attendance: {
        where: {
          dateIn: {
            gte: startOfDay(now),
            lt: endOfDay(now),
          },
          statusLeave: ApprovalStatus.APPROVED, // คัดกรองเฉพาะการลาที่มีสถานะ approved
        },
      },
      task: {
        where: {
          startAt: {
            lte: endOfDay(now),
          },
          endAt: {
            gte: startOfDay(now),
          },
        },
      },
    },
  });

  // กรองสมาชิกที่ไม่มีการลงชื่อและไม่มีการสร้างงาน
  const absentMembers = teamMembers
    .filter(
      (member) => member.attendance.length === 0 && member.task.length === 0,
    )
    .map((member) => ({
      id: member.id,
      name: member.user?.username ?? "Unknown", // ใช้ชื่อจากข้อมูล user หรือ "Unknown" หากไม่มีชื่อ
    }));

  return absentMembers;
}
