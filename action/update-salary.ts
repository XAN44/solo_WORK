"use server";
import { z } from "zod";
import { AccumulationSettingsSchema } from "../schema/validateSalary";
import { db } from "../src/lib/db";

export const UpdateSalary = async (
  value: z.infer<typeof AccumulationSettingsSchema>,
) => {
  // ตรวจสอบความถูกต้องของข้อมูลที่ส่งมา
  const validateField = AccumulationSettingsSchema.safeParse(value);

  if (!validateField.success) {
    return { error: "Invalid input data" };
  }

  const { typeOfWork, amount } = validateField.data;

  try {
    // ค้นหา record ที่มีอยู่แล้วจากฐานข้อมูล
    const existingSettings = await db.accumulationSettings.findFirst({
      where: {
        typeOfWork: typeOfWork,
      },
    });

    if (existingSettings) {
      // อัพเดตข้อมูลที่มีอยู่แล้ว
      await db.accumulationSettings.update({
        where: {
          id: existingSettings.id, // ใช้ id ที่ค้นหาได้
        },
        data: {
          amount: amount,
        },
      });
    } else {
      // สร้างข้อมูลใหม่
      await db.accumulationSettings.create({
        data: {
          typeOfWork: typeOfWork,
          amount: amount,
        },
      });
    }

    return { success: "Salary settings updated successfully" };
  } catch (error) {
    console.error("Error updating salary settings:", error);
    return { error: "Failed to update salary settings" };
  }
};
