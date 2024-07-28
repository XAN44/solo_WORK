"use server";

import { db } from "../src/lib/db";

export async function FetchAllTask(userId: string) {
  const tasks = await db.task.findMany({
    where: { userId },
    include: {
      user: true,
    },
  });

  return tasks;
}

export async function FetchAllAtten(userId: string) {
  const Atten = await db.attendance.findMany({
    where: { userId },
  });

  return Atten;
}
