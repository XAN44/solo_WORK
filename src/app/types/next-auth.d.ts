import { User } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

// TODO : ขบายประเภท DefaultSession
// * เพื่อให้ตัวแปร ExtendendUser สามารถนำไปใช้กับ Interface/Props ทั่วทุกหน้าของ Page ได้ โดยจะทำการดึงข้อมูลผู้ใช้จาก Session ที่ได้เข้าสู่ระบบ
export type ExtendendUser = DefaultSession["user"] & {
  level: "Admin" | "Supervisor" | "General";
  role: "Employe" | "Trainee";
  username: string;
  job: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendendUser;
  }
}
