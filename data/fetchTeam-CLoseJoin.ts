"use server";

import { auth } from "../auth";
import { db } from "../src/lib/db";

export async function FetchTeam() {
  const user = await auth();
  const checkTeam = await db.teamMember.findFirst({
    where: {
      userId: user?.user.id,
    },
    select: {
      id: true,
    },
  });

  return checkTeam;
}
