"use server";
import { z } from "zod";
import { db } from "../src/lib/db";
import { UpdateTaskSchema } from "./update_tasks";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";

export async function UpdateTask(
  taskId: string,
  data: z.infer<typeof UpdateTaskSchema>,
) {
  const validateField = UpdateTaskSchema.safeParse(data);
  const user = await auth();
  const userId = user?.user.id || "";

  if (!validateField.success) {
    return { error: "Invalid input" };
  }

  const { title, description } = validateField.data;

  try {
    const task = await db.task.findUnique({
      where: { id: taskId },
      include: {
        teamMember: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!task) {
      return { error: "Task not found" };
    }

    // Check if the user is the owner of the task
    if (task.teamMember?.userId !== userId) {
      return { error: "You are not authorized to update this task" };
    }

    const taskCreateTime = task.dateCreateAt;

    const now = new Date();
    const taskCreationDate = new Date(taskCreateTime);
    const hoursPassed =
      Math.abs(now.getTime() - taskCreationDate.getTime()) / (1000 * 60 * 60);

    if (hoursPassed > 8) {
      return {
        error: "You cannot update this task after 8 hours from its creation",
      };
    }

    await db.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
      },
    });

    revalidatePath("/");
    return { success: "Task updated successfully" };
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
}
