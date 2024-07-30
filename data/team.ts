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

export async function GetAdminInTeam(userId: string) {
  // ค้นหาข้อมูลสมาชิกทีมที่มี userId ตรงกัน
  const teamMember = await db.team.findFirst({
    where: {
      member: {
        some: {
          userId,
        },
      },
    },
    select: {
      admin: {
        select: {
          email: true,
        },
      },
    },
  });

  return teamMember?.admin?.email || null;
}
