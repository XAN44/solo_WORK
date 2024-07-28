import { Attendance, typeOfWork } from "@prisma/client";
import * as z from "zod";

export const StartWorkSchema = z.object({
  title: z.string().min(1, ""),
  description: z.string().min(1),
  typeOfWork: z.nativeEnum(typeOfWork),
  startAt: z.date(),
  endAt: z.date(),
});
