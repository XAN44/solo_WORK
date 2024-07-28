"use server";
import { db } from "../src/lib/db";

export async function GetSupervisorById(id: string) {
  const data = await db.user.findUnique({
    where: {
      id,
    },
    select: {
      supervisor: {
        select: {
          email: true,
          username: true,
        },
      },
    },
  });

  return data;
}
