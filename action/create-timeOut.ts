"use server";
import { z } from "zod";
import { TimeOutWorkSchema } from "../schema/validateStatusWork";
import { auth } from "../auth";
import { db } from "../src/lib/db";
import { revalidatePath } from "next/cache";
import { sendMailWithTimeOut } from "../src/lib/sendMail_TimeOut";
import { getUserById } from "../data/user";
import { endOfDay, startOfDay } from "date-fns";
import { GetAdminByTeamId } from "../data/supervisor";
import { GetTeamById } from "../data/team";

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

  await db.attendance.update({
    where: { id },
    data: { dateOut },
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

  const team = await GetTeamById(user?.user.id || "");
  const emailAdmin = (await team?.admin?.email) || "";
  await sendMailWithTimeOut(
    emailAdmin,
    dataUser.username || "",
    dataUser.first_name || "",
    dataUser.last_name || "",
    dataUser.department || "",
    attendance.teamMember.team?.project || "",
    attendance.dateIn,
    attendance.dateOut,
    dateOut,
    taskToday.map((task) => ({
      title: task.title,
      status: task.status,
    })), // ส่งข้อมูล tasks ที่ถูกต้อง
  );

  revalidatePath("/");
  return { success: "Check-out successful" };
}
