import { StatusTask } from "@prisma/client";

export const SelectStatusWork = [
  {
    value: StatusTask.pending,
    label: StatusTask.pending,
  },
  {
    value: StatusTask.OnHold,
    label: StatusTask.OnHold,
  },
  {
    value: StatusTask.InProgress,
    label: StatusTask.InProgress,
  },
  {
    value: StatusTask.Completed,
    label: StatusTask.Completed,
  },
  {
    value: StatusTask.Cancelled,
    label: StatusTask.Cancelled,
  },
];
