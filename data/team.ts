"use server";

import { db } from "../src/lib/db";

export async function GetTeamById(id: string) {
  const team = await db.teamMember.findFirst({
    where: {
      userId: id,
    },
    select: {
      team: {
        select: {
          department: true,
          project: true,
        },
      },
    },
  });
  return team;
}
