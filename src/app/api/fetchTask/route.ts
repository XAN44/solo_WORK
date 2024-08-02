import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET(req: Request, res: Response) {
  const { searchParams } = new URL(req.url);
  const teamMemberId = searchParams.get("id");

  if (!teamMemberId) {
    return NextResponse.json(
      { message: "You are not a member of any team" },
      { status: 400 },
    );
  }
  // ดึงข้อมูลจากตาราง task และ attendance
  const data = await db.teamMember.findUnique({
    where: {
      id: teamMemberId,
    },
    include: {
      task: {
        // Assuming that you have a relation called tasks
        orderBy: {
          startAt: "asc",
        },
      },
      AccumulatedAmount: {
        select: {
          amount: true,
        },
      },
    },
  });

  if (!data) {
    return NextResponse.json({ message: "No data found" }, { status: 404 });
  }
  const totalAmount = data?.AccumulatedAmount.reduce(
    (sum, entry) => sum + entry.amount,
    0,
  );
  console.log("Fetched Data:", data);

  return NextResponse.json({ totalAmount, tasks: data.task });
}
