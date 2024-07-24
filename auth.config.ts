import bcrypt from "bcryptjs";
import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";
import { SignInSchema } from "./schema/validatSign";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail, getUserByUsername } from "./data/user";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        // TODO: ใช้ zod ในการรับค่า Field แล้วนำค่าของ credentials (ค่าจากการกรอกข้อมูล) ยัดเข้าไปใน SignInSchema
        const validateField = SignInSchema.safeParse(credentials);
        // TODO: ถ้าหากว่าข้อมูลถูกต้อง จะทำการตรวจสอบข้อมูลใน database ดั่ง logic ด้านล่าง
        if (validateField.success) {
          const { username, password } = validateField.data;

          const user = await getUserByUsername(username);
          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          // * ถ้าหาก Password === user.password return user กลับไป
          if (passwordMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
