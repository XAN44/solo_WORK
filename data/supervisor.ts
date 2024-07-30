"use server";
import { db } from "../src/lib/db";

export async function GetSupervisorById(id: string) {
  const data = await db.user.findUnique({
    where: {
      id,
    },
    select: {
      supervisor: {
        select: {
          id: true,
          email: true,
          username: true,
        },
      },
    },
  });

  return data?.supervisor || null; // แน่ใจว่าเราส่งค่าที่มีอยู่
}

export async function GetSupervisorInTeamById(id: string) {
  const supervisor = await db.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      teamMember: {
        select: {
          userId: true,
          team: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  return supervisor;
}

export async function GetAdminByTeamId(teamId: string) {
  const team = await db.team.findUnique({
    where: {
      id: teamId,
    },
    select: {
      admin: {
        select: {
          email: true,
          username: true,
        },
      },
    },
  });

  return team?.admin || null;
}
