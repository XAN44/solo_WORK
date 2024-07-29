"use server";

import { db } from "../src/lib/db";
import { currentUser } from "../src/lib/auth";

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

  console.log("Total accumulated amount:", totalAmount); // แสดงผลยอดรวม

  return {
    totalAmount, // ส่งคืนยอดรวมของยอดเงินสะสม
  };
}
