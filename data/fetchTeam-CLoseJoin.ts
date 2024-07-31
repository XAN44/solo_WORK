"use server";

import { auth } from "../auth";
import { db } from "../src/lib/db";

export async function FetchTeam() {
  try {
    // ดึงข้อมูลผู้ใช้
    const user = await auth();

    // ตรวจสอบว่า user มี id หรือไม่
    if (!user || !user.user.id) {
      console.log("User not found or user ID is missing.");
      return null;
    }

    console.log(user.user.email);

    // ค้นหาข้อมูลทีมของผู้ใช้
    await db.teamMember.findFirst({
      where: {
        user: {
          id: user.user.id,
        },
      },
      select: {
        user: true,
      },
    });

    return { success: "Have team" };
  } catch (error) {
    return { error: error };
  }
}
