"use server";
import { z } from "zod";
import { StartWorkSchema } from "../schema/validateStartWork";
import { startOfDay, isAfter, isBefore } from "date-fns";
import { db } from "../src/lib/db";
import { CreateAt, StatusTask } from "@prisma/client";
import { auth } from "../auth";
import { createAttendence } from "./create-attendence";
import { revalidatePath } from "next/cache";
import { createAttendenceBackDated } from "./create-attendenceBackdated";

export const StartWorkAction = async (
  value: z.infer<typeof StartWorkSchema>,
) => {
  const validateField = StartWorkSchema.safeParse(value);

  if (!validateField.success) {
    return { error: "invalid field" };
  }

  const { title, description, startAt, endAt, typeOfWork } = validateField.data;
  const now = new Date();
  const startAtDate = startOfDay(new Date(startAt));
  const endAtDate = new Date(endAt);

  // ตรวจสอบช่วงวันที่
  if (endAtDate < startAtDate) {
    return { error: "The end date must be after the start date" };
  }

  // ตรวจสอบการสร้างงานในอนาคต
  if (isAfter(startAtDate, now)) {
    return { error: "You cannot create tasks for future dates" };
  }

  const user = await auth();
  const userId = user?.user.id || "";

  // ค้นหา `id` จาก `userId`
  const teamMember = await db.teamMember.findFirst({
    where: { userId: userId },
    select: { id: true },
  });

  if (!teamMember) {
    return { error: "Team member not found" };
  }

  const createAt = isBefore(startAtDate, startOfDay(now))
    ? CreateAt.Backdate
    : CreateAt.Normal;

  // ตรวจสอบงานที่มีอยู่แล้ว
  const existingTask = await db.task.findFirst({
    where: {
      teamMemberId: teamMember.id,
      startAt,
    },
  });

  if (existingTask) {
    const errorMsg =
      createAt === CreateAt.Normal
        ? "คุณสามารถสร้างงานได้เพียงงานเดียวต่อวันสำหรับวันที่ปัจจุบัน"
        : "คุณสามารถสร้างงานได้เพียงงานเดียวต่อวันสำหรับงานย้อนหลัง";
    return { error: errorMsg };
  }

  await db.task.create({
    data: {
      title,
      description,
      typeOfWork,
      startAt,
      endAt,
      createAt,
      status: StatusTask.pending,
      teamMemberId: teamMember.id,
      dateCreateAt: now,
    },
  });

  if (createAt === CreateAt.Normal) {
    await createAttendence(teamMember.id, now);
  } else {
    await createAttendenceBackDated(teamMember.id, startAt, endAt);
  }

  revalidatePath("/");
  return { success: "Create task success" };
};
