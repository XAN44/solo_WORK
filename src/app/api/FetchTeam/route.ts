import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { db } from "../../../lib/db";

export async function GET(req: Request) {
  try {
    const user = await auth(); // ใช้ใน request scope เท่านั้น
    if (!user || !user.user.id) {
      console.log("User not found or user ID is missing.");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const data = await db.teamMember.findFirst({
      where: {
        user: {
          id: user.user.id,
        },
      },
      select: {
        id: true, // ตรวจสอบว่าเลือก id ออกมาด้วย
        userId: true,
        user: {
          select: {
            id: true,
            supervisorId: true, // ถ้าจำเป็น
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json(
        { error: "Team data not found" },
        { status: 404 },
      );
    }

    console.log("Data being sent to client:", data); // ดีบักข้อมูลที่ถูกส่งกลับ

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching team data:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 },
    );
  }
}
