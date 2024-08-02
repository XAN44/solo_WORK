"use server";

import { db } from "../src/lib/db";
import { currentUser } from "../src/lib/auth";
import { revalidatePath } from "next/cache";

export async function FetchDataSumary(id: string) {
  // ดึงข้อมูลยอดเงินสะสมจากฐานข้อมูล
  const accumulatedAmounts = await db.accumulatedAmount.findMany({
    where: {
      teamMemberId: id,
    },
    select: {
      amount: true,
    },
  });

  // คำนวณยอดรวม
  const totalAmount = accumulatedAmounts.reduce(
    (sum, entry) => sum + entry.amount,
    0,
  );

  revalidatePath("/");

  return {
    totalAmount, // ส่งคืนยอดรวมของยอดเงินสะสม
  };
}
