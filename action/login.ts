"use server";

import { z } from "zod";
import { SignInSchema } from "../schema/validatSign";
import { signIn } from "../auth";
import { DEFAULT_LOGIN_REDIRECT } from "../src/routes";
import { AuthError } from "next-auth";
import { getUserByUsername } from "../data/user";
import { generateVerificationToken } from "../src/lib/tokens";
import { sendVerificationEmailByNodemailer } from "../src/lib/sendMail";

export const LoginAction = async (value: z.infer<typeof SignInSchema>) => {
  const validateField = SignInSchema.safeParse(value);

  if (!validateField.success) {
    return { error: "invalid field" };
  }

  const { username, password } = validateField.data;

  const existingUser = await getUserByUsername(username);

  if (!existingUser || !existingUser?.username || !existingUser?.password) {
    return { error: "Account does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const verficaitionToken = await generateVerificationToken(
      existingUser.email || "",
    );

    // TODO : ส่งเมลไปยังบัญชีผู้สมัครด้วย nodeMailer
    await sendVerificationEmailByNodemailer(
      verficaitionToken.email,
      verficaitionToken.token,
    );
    return { success: "Confirmation email sent!" };
  }

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: "/dashboard",
    });

    return {
      success: "",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "invalid credentials!" };
        default:
          return { error: "Somthing went wrong!" };
      }
    }

    throw error;
  }
};
