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

  const Atten = await db.attendance.findMany({
    where: {
      teamMember: {
        id,
      },
    },
    orderBy: {
      dateIn: "asc",
    },
    select: {
      id: true,
      dateIn: true,
      dateOut: true,
      type: true,
      statusLeave: true,
    },
  });

  if (!Atten) {
    return NextResponse.json({ message: "No data found" }, { status: 404 });
  }

  console.log(Atten);

  return NextResponse.json(Atten);
}
