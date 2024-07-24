import { PrismaClient } from "@prisma/client";

// * ประกาศตัวแปร global ให้สามารถใช้งาน Prisma ได้ทั่วโปรเจ็ค
declare global {
  var prisma: PrismaClient | undefined;
}

// * สร้าง Intsance
export const db = globalThis.prisma || new PrismaClient();

// * ในกรณีที่ไม่ได้อยู่ในโหมด production. การทำเช่นนี้ช่วยป้องกันการสร้างหลาย instances ของ PrismaClient ในระหว่างการพัฒนา ซึ่งจะช่วยลดการเชื่อมต่อฐานข้อมูลที่ไม่จำเป็น.

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
