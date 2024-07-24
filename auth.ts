import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./src/lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import { User } from "@prisma/client";

export const {
  handlers: { POST, GET },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/sign-in",

    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      const existingUser = await getUserById(user.id || "");

      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.level && session.user) {
        session.user.level = token.level as "Admin" | "Supervisor" | "General";
      }

      if (token.role && session.user) {
        session.user.role = token.role as "Employee" | "Trainee";
      }

      if (token.username && session.user) {
        session.user.username = token.username as string;
      }

      if (token.job && session.user) {
        session.user.job = token.job as string;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.level = existingUser.level;
      token.role = existingUser.role;
      token.username = existingUser.username;
      token.job = existingUser.job;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
