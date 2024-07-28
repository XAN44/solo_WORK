import { ApprovalStatus, Attendance, TypeLeave } from "@prisma/client";
import * as z from "zod";

export const StartLeaveRequest = z.object({
  title: z.string().min(1, ""),
  reason: z.string().min(1),
  typeLeave: z.nativeEnum(TypeLeave),
  tel: z.string().min(1),
  dateIn: z.date(),
  dateOut: z.date(),
});

export const ApproveRequestSchema = z.object({
  id: z.string(),
  statusLeave: z.nativeEnum(ApprovalStatus),
});
