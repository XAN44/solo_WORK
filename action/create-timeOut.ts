"use server";
import { z } from "zod";
import { TimeOutWorkSchema } from "../schema/validateStatusWork";
import { auth } from "../auth"; // Assumes you have an auth module to get the current user
import { db } from "../src/lib/db"; // Assumes you have a database module for Prisma client
import { revalidatePath } from "next/cache";

export async function UpdateTimeOut(value: z.infer<typeof TimeOutWorkSchema>) {
  // Validate the input using Zod schema
  const validateField = TimeOutWorkSchema.safeParse(value);

  if (!validateField.success) {
    return { error: "Invalid input" };
  }

  const { dateOut, id } = validateField.data;
  const user = await auth(); // Get the currently authenticated user
  if (!user) {
    return { error: "User not authenticated" };
  }

  const userId = user.user.id;

  // Fetch the attendance record and check if it belongs to the authenticated user
  const attendance = await db.attendance.findUnique({
    where: { id },
    select: {
      id: true,
      teamMember: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!attendance) {
    return { error: "Attendance record not found" };
  }

  if (attendance.teamMember?.userId !== userId) {
    return { error: "Not authorized to check out this record" };
  }

  // Update the attendance record with the check-out time
  await db.attendance.update({
    where: { id },
    data: { dateOut },
  });

  revalidatePath("/");
  return { success: "Check-out successful" };
}
