"use server";
import { db } from "../src/lib/db";

export async function FetchDepartMent(departName: string) {
  await db.user.findMany({
    where: {
      department: departName,
    },
  });
  return;
}
