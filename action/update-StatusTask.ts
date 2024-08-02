"use server";
import { z } from "zod";
import { StatusWorkSchema } from "../schema/validateStatusWork";
import { db } from "../src/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { StatusTask } from "@prisma/client";
import { sendWithApproveTask } from "../src/lib/sendMail_ApproveTask";

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

  try {
    const task = await db.task.findUnique({
      where: { id },
      include: {
        teamMember: {
          include: {
            user: true,
            team: true,
          },
        },
      },
    });

    if (!task) {
      return { error: "Task not found" };
    }

    const [isAdmin, settings] = await Promise.all([
      db.team.findFirst({
        where: {
          id: task.teamMember?.team?.id,
          adminId: userId,
        },
        select: { admin: true },
      }),
      db.accumulationSettings.findFirst({
        where: { typeOfWork: task.typeOfWork },
      }),
    ]);

    const isSupervisor = user?.user.level === "Supervisor";

    if (task.teamMember?.userId !== userId && !isAdmin && !isSupervisor) {
      return { error: "You are not authorized to update this task" };
    }

    if (status === StatusTask.Completed || status === StatusTask.Cancelled) {
      if (!isAdmin && !isSupervisor) {
        return {
          error: `Only Admin and Supervisor can update to ${status} status`,
        };
      }

      if (isSupervisor && task.teamMember?.userId === userId) {
        return { error: "Supervisor cannot approve their own task" };
      }

      if (!settings) {
        return { error: "No salary settings found for this type of work" };
      }

      const teamMemberId = task.teamMemberId;
      if (!teamMemberId) {
        return { error: "Team member ID is missing" };
      }

      const accumulatedAmount = await db.accumulatedAmount.findFirst({
        where: { teamMemberId },
      });

      if (accumulatedAmount) {
        await db.accumulatedAmount.update({
          where: { id: accumulatedAmount.id },
          data: {
            amount: {
              [status === StatusTask.Completed ? "increment" : "decrement"]:
                settings.amount,
            },
          },
        });
      } else {
        await db.accumulatedAmount.create({
          data: {
            teamMemberId,
            amount:
              status === StatusTask.Completed
                ? settings.amount
                : -settings.amount,
          },
        });
      }
    }

    await db.task.update({
      where: { id },
      data: { status },
    });

    const accumulatedAmount = await db.accumulatedAmount.findFirst({
      where: { teamMemberId: task.teamMemberId || "" },
    });

    if (status === StatusTask.Completed || status === StatusTask.Cancelled) {
      await sendWithApproveTask(
        task.teamMember?.user?.email || "",
        task.teamMember?.user?.first_name || "",
        task.teamMember?.user?.last_name || "",
        task.title,
        task.description,
        status,
      );
    }

    revalidatePath("/profile");
    return { success: "Success", accumulatedAmount };
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
}
