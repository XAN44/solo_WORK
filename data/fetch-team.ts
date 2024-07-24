"use server";

import { redirect } from "next/navigation";

import { db } from "../src/lib/db";
import { useCurrentLevel } from "../src/lib/auth";
import { auth } from "../auth";

export async function FetchTeam() {
  const currentUser = await auth();
  const user = await useCurrentLevel();
  try {
    if (user == "Admin") {
      const team = await db.team.findMany({
        select: {
          id: true,
          project: true,
          department: true,
          startAt: true,
          endAt: true,

          member: {
            select: {
              isSupervisor: true,
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });
      return team;
    }

    if (user == "Supervisor" || user == "General") {
      const team = await db.team.findMany({
        where: {
          member: {
            some: {
              userId: currentUser?.user.id,
            },
          },
        },
        select: {
          id: true,
          project: true,
          department: true,
          startAt: true,
          endAt: true,
          member: {
            select: {
              isSupervisor: true,
              user: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });
      return team;
    }
  } catch (error) {
    return null;
  }
}
