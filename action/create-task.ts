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
import { GetSupervisorById } from "../data/supervisor";
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

  // TODO ตรวจสอบว่ามีการลงชื้อแล้วหรือไม่
  const existingAttendence = await getAttendanceByIdAndDate(userId, now);

  // TODO ใช้สำหรับการเช็คเวลาลงชื่อ
  const today = new Date();

  // * หากยังไม่ลงชื่อ ให้ทำการลงชื่อเข้าทำงาน

  const task = await db.task.create({
    data: {
      title,
      description,
      typeOfWork,
      startAt,
      endAt,
      createAt: createAt,
      status: StatusTask.pending,
      userId: user?.user.id,
    },
  });

  if (existingAttendence.length === 0) {
    await createAttendence(userId, today); //* ใช้เวลาปัจจุบัน
  }
  const supervisor = await GetSupervisorById(user?.user.id || "");
  const userData = await getUserById(user?.user.id || "");
  const team = await GetTeamById(user?.user.id || "");
  await sendMailWithCreateTask(
    supervisor?.supervisor?.email || "",
    user?.user.username || "",
    userData?.first_name || "",
    userData?.last_name || "",
    team?.team?.department || "",
    supervisor?.supervisor?.username || "",
    team?.team?.project || "",
    task?.title || "",
    task?.status || "",
    startAt,
    endAt,
    description,
    typeOfWork,
    createAt,
  );

  revalidatePath("/");
  return {
    success: ` 
succeed ! The system will send an email to the supervisor. ${supervisor?.supervisor?.username}  `,
  };
};
