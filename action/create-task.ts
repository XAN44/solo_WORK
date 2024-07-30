"use server";
import { z } from "zod";
import { StartWorkSchema } from "../schema/validateStartWork";
import {
  endOfDay,
  format,
  getDay,
  getHours,
  isAfter,
  isBefore,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";
import { db } from "../src/lib/db";
import { Attendance, CreateAt, StatusTask } from "@prisma/client";
import { auth } from "../auth";
import { GetAdminByTeamId, GetSupervisorById } from "../data/supervisor";
import { sendMailWithCreateTask } from "../src/lib/sendMail_StartTask";
import { getUserByEmail, getUserById } from "../data/user";
import { GetTeamById } from "../data/team";
import { FetchTask } from "../data/fetch-task";
import { getLeaveRequestByDate } from "../data/fetch-leaveRequest";
import { getAttendanceByIdAndDate } from "../data/fetch-attendance";
import { createAttendence } from "./create-attendence";
import { revalidatePath } from "next/cache";

export const StartWorkAction = async (
  value: z.infer<typeof StartWorkSchema>,
) => {
  const validateField = StartWorkSchema.safeParse(value);

  const user = await auth();
  const userId = user?.user.id || "";

  if (!validateField.success) {
    return { error: "invalid field" };
  }
  const { title, description, startAt, endAt, typeOfWork } = validateField.data;

  //   TODO วันปัจจุบัน
  const now = startOfDay(new Date());
  //   TODO วันที่ผู้ใช้เลือก
  const startAtDate = startOfDay(new Date(startAt));
  //   TODO กำหนดค่า createAt and status ตามวันทีที่เลือก เพื่อตรวจสอบว่างานที่สร้าง เป็นงานปัจจุบัน หรืองานย้อนหลัง
  const createAt = isBefore(startAtDate, now)
    ? CreateAt.Backdate
    : CreateAt.Normal;

  const checkDateStart = new Date(startAt);
  const checkDateEnd = new Date(endAt);

  if (checkDateEnd < checkDateStart) {
    return {
      error: "Make sure you fill in information about the date correctly",
    };
  }

  // TODO ใช้สำหรับการเช็คเวลาลงชื่อ
  const today = new Date();

  const teamMember = await db.teamMember.findFirst({
    where: { userId: userId },
  });

  if (!teamMember) {
    return { error: "Team member not found" };
  }

  const existingTask = await db.task.findFirst({
    where: {
      teamMemberId: teamMember.id,
      startAt: startAt,
    },
  });

  if (existingTask) {
    if (createAt === CreateAt.Normal) {
      return {
        error: "You can only create one task per day for the current day",
      };
    } else {
      return {
        error: "You can only create one task per day for backdated tasks",
      };
    }
  }

  // TODO ตรวจสอบว่ามีการลงชื้อแล้วหรือไม่
  const existingAttendence = await getAttendanceByIdAndDate(teamMember.id, now);

  await db.task.create({
    data: {
      title,
      description,
      typeOfWork,
      startAt,
      endAt,
      createAt: createAt,
      status: StatusTask.pending,
      teamMemberId: teamMember.id,
      dateCreateAt: new Date(),
    },
  });

  // * หากยังไม่ลงชื่อ ให้ทำการลงชื่อเข้าทำงาน
  if (existingAttendence.length === 0) {
    await createAttendence(teamMember.id, today); //* ใช้เวลาปัจจุบัน
    console.log(teamMember.id, "TEAMMMMMMMMM");
  }

  revalidatePath("/");
  return {
    success: ` success create Task`,
  };
};
