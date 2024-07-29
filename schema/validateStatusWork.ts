import { StatusTask } from "@prisma/client";
import * as z from "zod";

export const StatusWorkSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(StatusTask),
});

export const TimeOutWorkSchema = z.object({
  id: z.string(),
  dateOut: z.date(),
});
