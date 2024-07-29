"use server";

import { db } from "../src/lib/db";
import { Attendance } from "@prisma/client";

export async function markAbsent(memberId: string) {
  const now = new Date();
}
