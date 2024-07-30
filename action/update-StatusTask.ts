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
  try {
    const validateField = StatusWorkSchema.safeParse(value);
    const user = await auth();
    const userId = user?.user.id || "";

    if (!validateField.success) {
      return { error: "Error: Invalid input" };
    }

    const { id, status } = validateField.data;

    // ตรวจสอบว่า user เป็น supervisor หรือไม่
    const supervisor = await GetSupervisorInTeamById(userId);
    // ประกาศตัวแปรรับค่าแอดมิน
    const isAdmin = user?.user.level === "Admin";

    if (!supervisor && !isAdmin) {
      return { error: "You are not authorized to update this task" };
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

    // ตรวจสอบว่าสถานะของงานไม่สามารถเปลี่ยนแปลงได้ถ้าสถานะปัจจุบันเป็น Completed หรือ Cancelled
    if (
      task.status === StatusTask.Completed ||
      task.status === StatusTask.Cancelled
    ) {
      return {
        error:
          "Cannot change status as the task is already completed or cancelled",
      };
    }

    if (status === StatusTask.Completed || status === StatusTask.Cancelled) {
      if (!isAdmin) {
        return { error: `Only Admin can update to ${status} status` };
      }

      // TODO หาค่าของเงินที่แอดมินได้ตั้งค่าไว้ว่างานประเภทนั้นๆ จะได้รับเงินเท่าไหร่ต่องาน
      const settings = await db.accumulationSettings.findFirst({
        where: {
          typeOfWork: task.typeOfWork,
        },
      });

      if (!settings) {
        return { error: "No salary settings found for this type of work" };
      }

      if (task.teamMemberId) {
        if (status === StatusTask.Completed) {
          // ค้นหาข้อมูลที่มี teamMemberId ตรงกัน
          const existingAmount = await db.accumulatedAmount.findFirst({
            where: {
              teamMemberId: task.teamMemberId,
            },
          });

          if (existingAmount) {
            // อัปเดตข้อมูลที่มีอยู่
            await db.accumulatedAmount.update({
              where: {
                id: existingAmount.id, // ใช้ id ของข้อมูลที่ค้นพบ
              },
              data: {
                amount: {
                  increment: settings.amount,
                },
              },
            });
          } else {
            // สร้างข้อมูลใหม่ถ้าไม่พบข้อมูลที่ตรงกัน
            await db.accumulatedAmount.create({
              data: {
                teamMemberId: task.teamMemberId,
                amount: settings.amount,
              },
            });
          }
        } else if (status === StatusTask.Cancelled) {
          // ค้นหาข้อมูลที่มี teamMemberId ตรงกัน
          const existingAmount = await db.accumulatedAmount.findFirst({
            where: {
              teamMemberId: task.teamMemberId,
            },
          });

          if (existingAmount) {
            // อัปเดตข้อมูลที่มีอยู่
            await db.accumulatedAmount.update({
              where: {
                id: existingAmount.id, // ใช้ id ของข้อมูลที่ค้นพบ
              },
              data: {
                amount: {
                  decrement: settings.amount,
                },
              },
            });
          } else {
            // สร้างข้อมูลใหม่ถ้าไม่พบข้อมูลที่ตรงกัน
            await db.accumulatedAmount.create({
              data: {
                teamMemberId: task.teamMemberId,
                amount: -settings.amount,
              },
            });
          }
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
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
}
