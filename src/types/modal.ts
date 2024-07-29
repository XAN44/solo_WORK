import { attendance, team, teamMember, User } from "@prisma/client";

export interface UserInfo {
  id: string;
  username: string | null;
  department: string | null;
}

export interface Department {
  value: string;
  label: string;
}

export type TeamFull = {
  id: string;
  project: string | null;
  department: string | null;
  startAt: Date | null;
  endAt: Date | null;
  status: string | null;
  detail: string | null;
  adminId: string | null;
  member: {
    id: string;
    isSupervisor: boolean | null;
    user: {
      id: string;
      username: string | null;
      role: string | null;
      job: string | null;
    } | null;
    attendance: {
      dateIn: Date | null;
      dateOut: Date | null;
    }[];
  }[];
};
