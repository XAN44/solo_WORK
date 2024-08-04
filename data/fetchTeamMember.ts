"use server";

import { auth } from "../auth";
import { db } from "../src/lib/db";

export async function FetchMemberTeam(id: string) {
  const teamMember = await db.teamMember.findFirst({
    where: {
      id: id,
    },
    select: {
      userId: true,
    },
  });

  return teamMember?.userId || "";
}
