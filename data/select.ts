"use server";

import { db } from "../src/lib/db";

export const SelectSupervisor = async () => {
  try {
    const data = await db.user.findMany({
      select: {
        id: true,
        username: true,
      },
    });

    return data;
  } catch (error) {
    console.error("Error fetching users:", error);

    return;
  }
};
