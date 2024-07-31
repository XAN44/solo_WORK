"use server";
import { db } from "../src/lib/db";
import { UserRole } from "@prisma/client"; // นำเข้าประเภท UserRole

export async function getUsersByRole(roles: UserRole[]): Promise<string[]> {
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
