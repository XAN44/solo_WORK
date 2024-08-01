import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { db } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";

export async function GET(req: Request, res: Response) {
  const user = await currentUser();
  console.log(user);

  if (!user || !user.id) {
    console.log("User not found or user ID is missing.");
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userId = user.id;

  const data = await db.teamMember.findFirst({
    where: {
      userId,
    },
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

  return NextResponse.json(data);
}
