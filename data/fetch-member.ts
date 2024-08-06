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

  // TODO ดึงข้อมูลของผู้ใช้ตามแผนกที่มีการเลือก หรือถ้าหากต้องการแสดงเฉพาะผู้ใช้ที่ยังไม่ได้เป็น Supervisor ให้เพิ่มเงื่อนไขเข้าไปที่ where
  const user = await db.user.findMany({
    where: {
      department: departName,
    },
    select: {
      id: true,
      username: true,
      department: true,
    },
  });

  return user;
}
