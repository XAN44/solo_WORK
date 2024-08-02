"use server";
import { z } from "zod";
import { StatusWorkSchema } from "../schema/validateStatusWork";
import { db } from "../src/lib/db";
import { revalidatePath } from "next/cache";
import { GetSupervisorInTeamById } from "../data/supervisor";
import { auth } from "../auth";
import { StatusTask } from "@prisma/client";
import { sendWithApproveTask } from "../src/lib/sendMail_ApproveTask";

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
    // const supervisor = await GetSupervisorInTeamById(userId);
    const isSupervisor = user?.user.level === "Supervisor";
    // ประกาศตัวแปรรับค่าแอดมิน

    // ดึงข้อมูล task เพื่อเช็คทีมที่เกี่ยวข้องและผู้สร้าง task
    const task = await db.task.findUnique({
      where: {
        id,
      },
      select: {
        typeOfWork: true,
        teamMemberId: true,
        title: true,
        description: true,
        status: true, // เพิ่มการดึงสถานะปัจจุบันของงาน

        teamMember: {
          select: {
            userId: true,
            user: {
              select: {
                email: true,
                first_name: true,
                last_name: true,
              },
            },
            team: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      return { error: "Task not found" };
    }

    // TODO : หา Admin ของทีม
    const isAdmin = await db.team.findFirst({
      where: {
        id: task?.teamMember?.team?.id,
        adminId: userId,
      },
      select: {
        admin: {
          select: {
            username: true,
          },
        },
      },
    });

    if (
      task.teamMember?.userId !== user?.user.id &&
      !isAdmin &&
      !isSupervisor
    ) {
      return { error: "You are not authorized to update this task" };
    }

    // TODO หากสถานะเป็น Completed หรือ Canclled จะต้องผ่านแอดมินหรือหัวหน้างาน
    if (status === StatusTask.Completed || status === StatusTask.Cancelled) {
      if (!isAdmin && !isSupervisor) {
        return {
          error: `Only Admin and Supervisor can update to ${status} status`,
        };
      }

      // TODO หากงานนั้นๆเป็นของตัวหัวหน้างานเอง จะไม่สามารถอนุมัติงานได้
      if (isSupervisor && task.teamMember?.userId === userId) {
        return { error: "Supervisor cannot approve their own task" };
      }

      //  TODO หาค่าของเงินที่แอดมินได้ตั้งค่าไว้ว่างานประเภทนั้นๆ จะได้รับเงินเท่าไหร่ต่องาน
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

    // TODO อัพเดทสถานะของ task
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
