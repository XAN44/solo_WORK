"use server";
import { db } from "../src/lib/db";

export async function getUsersByRole(roles: string[]): Promise<string[]> {
  const users = await db.user.findMany({
    where: {
      role: {
        in: roles,
      },
    },
    select: {
      id: true,
    },
  });
  return users.map((user) => user.id);
}
