import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { db } from "../../../lib/db";

export async function GET(req: Request) {
  try {
    const user = await auth(); // ใช้ใน request scope เท่านั้น
    if (!user || !user.user.id) {
      console.log("User not found or user ID is missing.");
      return NextResponse.json("error");
    }
    const data = await db.teamMember.findFirst({
      where: {
        user: {
          id: user.user.id,
        },
      },
      select: {
        user: true,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 },
    );
  }
}
