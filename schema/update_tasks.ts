import { z } from "zod";

export const UpdateTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "description is required"),
});
