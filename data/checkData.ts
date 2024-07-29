"use server";

import { db } from "../src/lib/db";

export const getMemberById = async (id: string) => {
  try {
    const user = await db.teamMember.findUnique({
      where: { id },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            supervisorId: true, // ดึงข้อมูล supervisorId
          },
        },
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};
