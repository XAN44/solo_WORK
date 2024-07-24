// * ใช้สำหรับตรวจสอบความถูกต้องของข้อมูล

import { UserLevel } from "@prisma/client";
import * as z from "zod";

export const SignInSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(6, { message: "Minimum of 6 characters required" }),
});

export const ResetSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Minimum of 6 characters required" }),
});

export const SignUpSchema = z
  .object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "invalid email" }),
    password: z
      .string()
      .min(4, { message: "Password must be more than 6 characters." }),
    confirmPassword: z.string().min(4),
    first_name: z.string(),
    last_name: z.string().min(1, { message: "invald last name" }),
    role: z.string({ required_error: "ples" }),
    level: z.nativeEnum(UserLevel),
    job: z.string(),
    department: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });
