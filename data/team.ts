"use server";

import { db } from "../src/lib/db";

export async function GetTeamById(userId: string) {
  // ค้นหาข้อมูลสมาชิกทีมที่มี userId ตรงกัน
  const teamMember = await db.teamMember.findFirst({
    where: {
      userId: userId,
    },
    select: {
      team: {
        select: {
          id: true,
          department: true,
          project: true,
          admin: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  return teamMember?.team || null;
}
