import { attendance, task, teamMember } from "@prisma/client";

export type DataModal = teamMember & {
  task: task[];
  attendance: attendance[];
};
