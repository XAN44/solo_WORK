"use server";
import { z } from "zod";
import { TimeOutWorkSchema } from "../schema/validateStatusWork";
import { auth } from "../auth";
import { db } from "../src/lib/db";
import { revalidatePath } from "next/cache";
import { sendMailWithTimeOut } from "../src/lib/sendMail_TimeOut";
import { getUserById } from "../data/user";
import { differenceInHours, endOfDay, startOfDay } from "date-fns";
import { GetAdminByTeamId, GetSupervisorById } from "../data/supervisor";
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

  // TODO : กรณีที่ทำงานไม่ถึง 4 ชั่วโมงต่อวัน แล้วมีการลงชื่อ = ขาด
  if (hoursWorked < 4) {
    await db.attendance.update({
      where: {
        id,
      },
      data: {
        dateOut,
        type: "Absent",
      },
    });
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
  const emailAdmin = (await team?.admin?.email) || " ";
  const supervisor = await GetSupervisorById(user?.user.id || "");

  const checkUser = await db.teamMember.findFirst({
    where: {
      userId: attendance.teamMember.userId,
    },
    select: {
      isSupervisor: true,
    },
  });

  const supervisorEmail = supervisor?.email || null;

  if (!emailAdmin && !supervisorEmail) {
    return { error: "No recipients defined" };
  }

  if (checkUser?.isSupervisor && emailAdmin) {
    await sendMailWithTimeOut(
      emailAdmin,
      dataUser.username || "",
      dataUser.first_name || "",
      dataUser.last_name || "",
      dataUser.department || "",
      attendance.teamMember.team?.project || "",
      attendance.dateIn,
      attendance.dateOut,
      taskToday.map((task) => ({
        title: task.title,
        status: task.status,
      })), // ส่งข้อมูล tasks ที่ถูกต้อง
      attendance.type,
    );
  }
  if (supervisorEmail) {
    await sendMailWithTimeOut(
      supervisorEmail,
      dataUser.username || "",
      dataUser.first_name || "",
      dataUser.last_name || "",
      dataUser.department || "",
      attendance.teamMember.team?.project || "",
      attendance.dateIn,
      attendance.dateOut,
      taskToday.map((task) => ({
        title: task.title,
        status: task.status,
      })), // ส่งข้อมูล tasks ที่ถูกต้อง
      attendance.type,
    );
  }

  revalidatePath("/");
  return { success: "Check-out successful" };
}
