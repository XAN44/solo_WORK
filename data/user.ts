"use server";

import { db } from "../src/lib/db";

export const getUserByUsername = async (username: string) => {
  // TODO : ดึงข้อมูลผู้ใช้ด้วย Email

  try {
    const user = await db.user.findUnique({
      where: { username },
    });

    return user;
  } catch (error) {
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  // TODO : ดึงข้อมูลผู้ใช้ด้วย Email

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  // TODO : ดึงข้อมูลผู้ใช้ด้วย ID

  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        username: true,
        password: true,
        emailVerified: true,
        email: true,
        job: true,
        role: true,
        level: true,
        department: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};

export const getMemberById = async (id: string) => {
  // TODO : ดึงข้อมูลผู้ใช้ด้วย ID

  try {
    const user = await db.teamMember.findFirst({
      where: { id },
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            id: true,
            supervisorId: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};

export const getProfileTeamById = async (userId: string) => {
  // TODO : ดึงข้อมูลผู้ใช้ด้วย ID

  try {
    const user = await db.teamMember.findFirst({
      where: {
        userId,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};
