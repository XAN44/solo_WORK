"use server";
import { z } from "zod";
import { StatusWorkSchema } from "../schema/validateStatusWork";
import { db } from "../src/lib/db";
import { revalidatePath } from "next/cache";
import { GetSupervisorInTeamById } from "../data/supervisor";
import { auth } from "../auth";
import { StatusTask } from "@prisma/client";

export async function UpdateStatusTask(
  value: z.infer<typeof StatusWorkSchema>,
) {
  const validateField = StatusWorkSchema.safeParse(value);
  const user = await auth();
  const userId = user?.user.id || "";

  if (!validateField.success) {
    return { error: "Error: Invalid input" };
  }

  const { id, status } = validateField.data;

  // ตรวจสอบว่า user เป็น supervisor หรือไม่
  const supervisor = await GetSupervisorInTeamById(userId);
  if (!supervisor) {
    return { error: "You are not a supervisor" };
  }

  // ดึงข้อมูล task เพื่อเช็คทีมที่เกี่ยวข้องและผู้สร้าง task
  const task = await db.task.findUnique({
    where: {
      id,
    },
    select: {
      typeOfWork: true,
      teamMemberId: true,
      teamMember: {
        select: {
          userId: true,
          team: {
            select: {
              id: true,
            },
          },
        },
      },
      status: true, // เพิ่มการดึงสถานะปัจจุบันของงาน
    },
  });

  if (!task) {
    return { error: "Task not found" };
  }

  // ตรวจสอบว่าทีมของ task ตรงกับทีมของ supervisor หรือไม่
  const supervisorTeamIds = supervisor.teamMember.map((tm) => tm.team?.id);
  if (!supervisorTeamIds.includes(task.teamMember?.team?.id)) {
    return { error: "You are not authorized to update this task" };
  }

  // ตรวจสอบว่า task ถูกสร้างโดย supervisor เองหรือไม่
  const isTaskCreatedBySupervisor = task.teamMember?.userId === userId;

  // ตรวจสอบสถานะใหม่ของงาน
  if (status === StatusTask.Completed) {
    const isAdmin = user?.user.level === "Admin"; // ตรวจสอบสถานะของ Admin จากข้อมูล user

    // ตรวจสอบว่างานนั้นเคยถูกอัพเดทเป็น Completed หรือไม่
    if (task.status === StatusTask.Completed) {
      return {
        error:
          "Task has already been marked as Completed and cannot be updated again.",
      };
    }

    if (!isAdmin) {
      // Supervisor ไม่สามารถอัพเดตสถานะเป็น Completed ได้โดยตรงถ้าตนเองสร้างงาน
      if (isTaskCreatedBySupervisor) {
        return { error: "Supervisors cannot approve their own tasks." };
      }
      const settings = await db.accumulationSettings.findFirst({
        where: {
          typeOfWork: task.typeOfWork,
        },
      });

      if (!settings) {
        return { error: "No salary settings found for this type of work" };
      }

      // ตรวจสอบว่า teamMemberId ไม่เป็น null หรือ undefined
      if (task.teamMemberId) {
        // ใช้ upsert เพื่อเพิ่มหรืออัพเดตข้อมูลใน accumulated_amounts
        await db.accumulatedAmount.upsert({
          where: {
            id: task.teamMemberId,
          },
          update: {
            amount: {
              increment: settings.amount,
            },
          },
          create: {
            teamMemberId: task.teamMemberId || "",
            amount: settings.amount,
          },
        });
      }
    }
  }

  // อัพเดทสถานะของ task
  await db.task.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  revalidatePath("/");
  return { success: "Success" };
}
