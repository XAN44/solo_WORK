import { ApprovalStatus, TypeLeave } from "@prisma/client";

export const TypeLeaveSelect = [
  {
    value: TypeLeave.BEREAVEMENT,
    label: TypeLeave.BEREAVEMENT,
  },
  {
    value: TypeLeave.MATERNITY,
    label: TypeLeave.MATERNITY,
  },
  {
    value: TypeLeave.PATERNITY,
    label: TypeLeave.PATERNITY,
  },
  {
    value: TypeLeave.PERSONAL,
    label: TypeLeave.PERSONAL,
  },
  {
    value: TypeLeave.SICK,
    label: TypeLeave.SICK,
  },
  {
    value: TypeLeave.STUDY,
    label: TypeLeave.STUDY,
  },
  {
    value: TypeLeave.VACATION,
    label: TypeLeave.VACATION,
  },
];

export const SelectApprove = [
  {
    value: ApprovalStatus.APPROVED,
    label: ApprovalStatus.APPROVED,
  },
  {
    value: ApprovalStatus.PENDING,
    label: ApprovalStatus.PENDING,
  },
  {
    value: ApprovalStatus.REJECTED,
    label: ApprovalStatus.REJECTED,
  },
];
