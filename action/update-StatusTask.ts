"use server";
import { z } from "zod";
import { StatusWorkSchema } from "../schema/validateStatusWork";
export async function UpdateStatusTask(
  value: z.infer<typeof StatusWorkSchema>,
) {
  const validateField = StatusWorkSchema.safeParse(value);

  if (!validateField.success) {
    return { error: "Error " };
  }

  const { id, status } = validateField.data;

  console.log(status);

  return { success: "Success" };
}
