import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { message: "You are not a member of any team" },
      { status: 400 },
    );
  }
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

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 },
    );
  }
}
