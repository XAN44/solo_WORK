"use server";
import { db } from "../src/lib/db";

export async function FetchAllTaskAndAtten(teamMemberId: string) {
  // ดึงข้อมูลจากตาราง task และ attendance
  const data = await db.teamMember.findUnique({
    where: {
      id: teamMemberId,
    },
    include: {
      task: {
        // Assuming that you have a relation called tasks
        orderBy: {
          startAt: "asc",
        },
      },
      attendance: {
        // Assuming that you have a relation called attendance
        orderBy: {
          dateIn: "asc",
        },
      },
    },
  });

  return data;
}

export async function FetchAllTask(teamMemberId: string) {
  const tasks = await db.task.findMany({
    where: {
      teamMember: {
        id: teamMemberId,
      },
    },
    orderBy: {
      startAt: "asc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      typeOfWork: true,
      endAt: true,
      startAt: true,
      status: true,
      createAt: true,
      teamMember: {
        select: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  });

  return tasks;
}
export async function FetchAllAtten(id: string) {
  const Atten = await db.attendance.findMany({
    where: {
      teamMember: {
        id,
      },
    },
    orderBy: {
      dateIn: "asc",
    },
    select: {
      id: true,
      dateIn: true,
      dateOut: true,
      type: true,
      statusLeave: true,
    },
  });

  console.log(Atten);
  return Atten;
}
