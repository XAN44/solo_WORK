"use server";
import { db } from "../src/lib/db";
import { getUserById } from "./user";

export async function FetchTask(id: string) {
  const user = await getUserById(id);
  const data = await db.task.findFirst({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createAt: "desc",
    },
    select: {
      title: true,
      status: true,
      startAt: true,
    },
  });
  return data;
}

export async function FetchAllTask(id: string) {
  const user = await getUserById(id);
  const data = await db.task.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createAt: "desc",
    },
    select: {
      title: true,
      status: true,
    },
  });
  return data;
}

export async function FetchAllTaskForSumery(id: string) {
  const user = await getUserById(id);
  const data = await db.task.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createAt: "desc",
    },
  });
  return data;
}
