import { team, teamMember, User } from "@prisma/client";

export interface UserInfo {
  id: string;
  username: string | null;
  department: string | null;
}

export interface Department {
  value: string;
  label: string;
}

export type TeamFull = team & {
  member: {
    isSupervisor: boolean | null;
    user: {
      username: string | null;
    } | null;
  }[];
};
