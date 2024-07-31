"use server";

import { auth } from "../auth";
import { db } from "../src/lib/db";

export async function FetchTeam() {
  try {
    const user = await auth();

    if (!user || !user.user.id) {
      console.log("User not found or user ID is missing.");
      return { success: false };
    }

    const data = await db.teamMember.findFirst({
      where: {
        user: {
          id: user.user.id,
        },
      },
      select: {
        user: true,
      },
    });

    if (data) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    return { error: error };
  }
}
