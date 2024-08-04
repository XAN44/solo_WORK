"use server";
import { revalidatePath } from "next/cache";
import { db } from "../src/lib/db";

export async function FetchAllTaskk(teamMemberId: string) {
  // ดึงข้อมูลจากตาราง task และ attendance
  const data = await db.teamMember.findUnique({
    where: {
      id: teamMemberId,
    },
    include: {
      task: {
        orderBy: {
          startAt: "asc",
        },
      },
    },
  });
  revalidatePath("/");

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

  revalidatePath("/");
  return Atten;
}
