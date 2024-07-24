"use server";
import { currentUser, useCurrentLevel } from "../src/lib/auth";
import { db } from "../src/lib/db";
import { FetchDepartMent } from "./fetch-departMent";

export async function GetMember(departName: string) {
  // TODO ถ้าหากไม่ใช่ Admin ให้ return null
  const session = await useCurrentLevel();
  if (session !== "Admin") {
    return [];
  }

  const user = await db.user.findMany({
    where: {
      department: departName,
      level: "General",
    },
    select: {
      id: true,
      username: true,
      department: true,
    },
  });

  return user;
}
