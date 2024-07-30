"use server";
import { z } from "zod";
import { SignUpSchema } from "../schema/validatSign";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { getUserByEmail, getUserByUsername } from "../data/user";
import { generateVerificationToken } from "../src/lib/tokens";
import { sendVerificationEmailByNodemailer } from "../src/lib/sendMail";

export async function Register_Action(value: z.infer<typeof SignUpSchema>) {
  // TODO : ใช้ ZOD ในการเช็คข้อมูลของ Value ที่ได้จาก FRONT-END
  const validateField = SignUpSchema.safeParse(value);
  // TODO : ตรวจสอบว่าสำเร็จหรือไม่
  if (!validateField.success) {
    return { error: "invalid field" };
  }

  // TODO : สับข้อมูลออกมา
  const {
    username,
    email,
    password,
    first_name,
    last_name,
    role,
    job,
    level,
    department,
  } = validateField.data;
  // TODO: เข้ารหัส
  const hashPassword = await bcrypt.hash(password, 10);

  // TODO : ตรวจสอบว่ามีการใช้ Email สมัครแล้วยัง
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use! " };
  }

  const existingUserByUsername = await getUserByUsername(username);
  if (existingUserByUsername) {
    return { error: "username already in use!" };
  }

  const userLevel = email.endsWith("@vannesplus.com") ? "Admin" : level;

  if (!email.endsWith("@vannesplus.com") && level === "Admin") {
    return {
      error:
        "You do not have permission to register an account with this privilege",
    };
  }

  await db.user.create({
    data: {
      username,
      email,
      password: hashPassword,
      first_name,
      last_name,
      role,
      job,
      level,
      department,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmailByNodemailer(
    verificationToken.email,
    verificationToken.token,
  );
  return {
    success:
      "We will send a confirmation email to the email address you registered with. Please confirm your identity within 1 hour",
  };
}
