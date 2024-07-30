"use server";
import { endOfDay, startOfDay } from "date-fns";
import { auth } from "../auth";
import { db } from "../src/lib/db";
import { useCurrentLevel } from "../src/lib/auth";

export async function FetchTeam() {
  const currentUser = await auth();
  const user = await useCurrentLevel();

  const today = new Date();
  try {
    if (user == "Admin") {
      const team = await db.team.findMany({
        select: {
          id: true,
          project: true,
          department: true,
          startAt: true,
          endAt: true,
          status: true,
          detail: true,
          adminId: true,
          member: {
            select: {
              id: true,
              isSupervisor: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  role: true,
                  job: true,
                },
              },
              attendance: {
                where: {
                  dateIn: {
                    gte: startOfDay(today),
                    lte: endOfDay(today),
                  },
                },
                select: {
                  dateIn: true,
                  dateOut: true,
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
          status: true,
          detail: true,
          adminId: true,
          member: {
            select: {
              id: true,
              isSupervisor: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  role: true,
                  job: true,
                },
              },
              attendance: {
                where: {
                  dateIn: {
                    gte: startOfDay(today),
                    lte: endOfDay(today),
                  },
                },
                select: {
                  dateIn: true,
                  dateOut: true,
                },
              },
            },
          },
        },
      });
      return team;
    }
    return null;
  } catch (error) {
    return null;
  }
}
