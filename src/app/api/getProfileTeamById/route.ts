import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { db } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";

export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");

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

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 },
    );
  }
}
