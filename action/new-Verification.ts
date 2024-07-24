"use server";
import { getUserByEmail } from "../data/user";
import { getVerificationTokenByToken } from "../data/verification-token";
import { db } from "../src/lib/db";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return {
      error:
        "The verification token you provided is invalid or does not exist. Please check the token or request a new verification email",
    };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {
      error:
        "The verification token you provided has expired. Please request a new verification email.",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      error:
        " No user is associated with this verification token. Please ensure you are using the correct email address.",
    };
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  // await db.verificationToken.delete({
  //   where: {
  //     id: existingToken.id,
  //   },
  // });

  return {
    success:
      "Your email has been successfully verified. You can now proceed to sign in.",
  };
};
