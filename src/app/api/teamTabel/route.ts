import { endOfDay, startOfDay } from "date-fns";
import { auth } from "../../../../auth";
import { useCurrentLevel } from "../../../lib/auth";
import { db } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const currentUser = await auth();
  const user = await useCurrentLevel();

  const today = new Date();

  try {
    let team;

    if (user === "Admin") {
      team = await db.team.findMany({
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
    } else if (user === "Supervisor" || user === "General") {
      team = await db.team.findMany({
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
    }

    return NextResponse.json(team || {});
  } catch (error) {
    console.error("Failed to fetch team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 },
    );
  }
}
