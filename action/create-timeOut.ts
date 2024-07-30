"use server";
import { z } from "zod";
import { TimeOutWorkSchema } from "../schema/validateStatusWork";
import { auth } from "../auth";
import { db } from "../src/lib/db";
import { revalidatePath } from "next/cache";
import { sendMailWithTimeOut } from "../src/lib/sendMail_TimeOut";
import { getUserById } from "../data/user";

export async function UpdateTimeOut(value: z.infer<typeof TimeOutWorkSchema>) {
  // Validate the input using Zod schema
  const validateField = TimeOutWorkSchema.safeParse(value);

  if (!validateField.success) {
    return { error: "Invalid input" };
  }

  const { dateOut, id } = validateField.data;
  const user = await auth();

  const dataUser = await getUserById(user?.user.id || "");
  if (!dataUser) {
    return { error: "User not authenticated" };
  }

  const userId = dataUser.id;

  const attendance = await db.attendance.findUnique({
    where: { id },
    select: {
      id: true,
      dateIn: true,
      dateOut: true,
      teamMember: {
        select: {
          userId: true,
          team: {
            select: {
              id: true,
              project: true,
              member: {
                select: {
                  user: {
                    select: {
                      email: true,
                      username: true,
                      first_name: true,
                      last_name: true,
                      department: true,
                    },
                  },
                  isSupervisor: true,
                },
              },
            },
          },
          StartAt: true,
          endAt: true,
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

  // Check if user already checked out today
  if (attendance.dateOut) {
    return { error: "You have already checked out today" };
  }

  // Update the attendance record with the check-out time
  await db.attendance.update({
    where: { id },
    data: { dateOut },
  });

  // Find the supervisor from the team members
  const supervisor = attendance.teamMember?.team?.member.find(
    (member) => member.isSupervisor,
  )?.user;

  if (supervisor?.email) {
    await sendMailWithTimeOut(
      supervisor.email,
      dataUser.username || "",
      dataUser.first_name || "",
      dataUser.last_name || "",
      dataUser.department || "",
      attendance.teamMember.team?.project || "",
      attendance.dateIn,
      attendance.dateOut,
      dateOut,
    );
  }

  revalidatePath("/");
  return { success: "Check-out successful" };
}
