"use server";
import { z } from "zod";
import { TimeOutWorkSchema } from "../schema/validateStatusWork";
import { auth } from "../auth";
import { db } from "../src/lib/db";
import { revalidatePath } from "next/cache";
import { sendMailWithTimeOut } from "../src/lib/sendMail_TimeOut";
import { getUserById } from "../data/user";
import { differenceInHours, endOfDay, startOfDay } from "date-fns";
import { GetSupervisorById } from "../data/supervisor";
import { GetTeamById } from "../data/team";
import { Attendance } from "@prisma/client";

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
      type: true,
      teamMember: {
        select: {
          id: true,
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

  if (attendance.dateOut) {
    return { error: "You have already checked out today" };
  }

  const startAt = attendance.dateIn;
  const endAt = dateOut;

  const hoursWorked = differenceInHours(
    new Date(endAt),
    new Date(startAt || ""),
  );

  const updateData =
    hoursWorked < 4
      ? { dateOut, type: Attendance.Absent } // Use the enum value instead of a plain string
      : { dateOut };

  await db.attendance.update({
    where: { id },
    data: updateData,
  });
  const taskToday = await db.task.findMany({
    where: {
      teamMemberId: attendance.teamMember.id,
      dateCreateAt: {
        gte: startOfDay(new Date()),
        lte: endOfDay(new Date()),
      },
    },
  });

  if (taskToday.length === 0) {
    return {
      error:
        "You haven't started work today. The system therefore does not send mail to Admin.",
    };
  }

  const [team, supervisor] = await Promise.all([
    GetTeamById(user?.user.id || ""),
    GetSupervisorById(user?.user.id || ""),
  ]);

  const emailAdmin = team?.admin?.email || " ";
  const checkUser = await db.teamMember.findFirst({
    where: {
      userId: attendance.teamMember.userId,
    },
    select: {
      isSupervisor: true,
    },
  });

  // ส่งเมล
  await sendMailWithTimeOut(
    emailAdmin,
    dataUser.username || "Unknown",
    dataUser.first_name || "Unknown",
    dataUser.last_name || "Unknown",
    dataUser.department || "Unknown",
    team?.project || "Unknown",

    taskToday.map((task) => ({ title: task.title, status: task.status })),
    updateData.type || "Checked Out",
  );

  revalidatePath("/");
  return { success: "Check-out successful" };
}
