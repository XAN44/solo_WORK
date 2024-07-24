import * as z from "zod";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

export const createTeamSchema = z.object({
  department: z.string().min(1, { message: "pless select department" }),
  supervisor: z.string().min(1, { message: "pless select supervisor" }),
  member: z.array(optionSchema).min(1, { message: "pless select member" }),
  project: z.string().min(1, { message: "pless write type work" }),
  report: z.string().min(1, { message: "pless write report work" }),
  startAt: z.date({ message: "pless select start work" }),
  endAt: z.date({ message: "pless select end work" }),
});
