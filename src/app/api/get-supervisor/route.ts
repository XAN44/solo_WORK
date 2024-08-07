// src/app/api/supervisors/route.ts
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET() {
  try {
    // ดึงข้อมูล Supervisor ปัจจุบันทั้งหมด
    const currentSupervisors = await db.user.findMany({
      where: { level: "Supervisor" }, // ตัวแทน Supervisor
      select: { id: true, username: true },
    });

    // ดึงผู้ใช้ที่มี Level เป็น 'general'
    const newSupervisors = await db.user.findMany({
      where: { level: "General" }, // สมมติว่า 'GENERAL' คือระดับทั่วไป
      select: { id: true, username: true },
    });

    return NextResponse.json({ currentSupervisors, newSupervisors });
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    return NextResponse.json(
      { error: "Error fetching supervisors" },
      { status: 500 },
    );
  }
}
