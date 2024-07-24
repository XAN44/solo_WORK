"use server";

import { z } from "zod";
import { ResetPasswordSchema } from "../schema/validatSign";
import { getPasswordResetToken } from "../data/password-reset-token";
import { getUserByEmail } from "../data/user";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";

export const newPassword = async (
  values: z.infer<typeof ResetPasswordSchema>,
  token?: string | null,
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validateField = ResetPasswordSchema.safeParse(values);

  if (!validateField.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validateField.data;

  const existingToken = await getPasswordResetToken(token);
  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password updated!" };
};
