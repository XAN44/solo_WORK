"use server";

import { z } from "zod";
import { ApproveRequestSchema } from "../schema/validateLeaveRequest";
import { db } from "../src/lib/db";
import { sendWithApproveRequest } from "../src/lib/sendMail_ApproveRequest";
import { revalidatePath } from "next/cache";

export async function ApproveLeaveRequest(
  value: z.infer<typeof ApproveRequestSchema>,
) {
  const validateField = ApproveRequestSchema.safeParse(value);
  try {
    if (!validateField.success) {
      return { error: "Error ! cannot approve" };
    }
    const { statusLeave, id } = validateField.data;

    const data = await db.attendance.update({
      where: {
        id: id,
      },
      data: {
        statusLeave,
      },
    });

    const fetchUser = await db.attendance.findFirst({
      where: {
        id,
      },
      select: {
        teamMember: {
          select: {
            user: {
              select: {
                first_name: true,
                last_name: true,
                email: true,
                username: true,
              },
            },
          },
        },
      },
    });

    await sendWithApproveRequest(
      id,
      fetchUser?.teamMember?.user?.email || "",
      fetchUser?.teamMember?.user?.first_name || "",
      data.title || "",
      fetchUser?.teamMember?.user?.last_name || "",
      statusLeave,
    );
    revalidatePath("/");
    return { success: "Success approve" };
  } catch (error) {
    return { error: `${error}` };
  }
}
