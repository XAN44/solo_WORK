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

export type TeamFull = team & {
  member: {
    isSupervisor: boolean | null;
    user: {
      id: string;
      username: string | null;
      role: string | null;
      job: string | null;
      attendance: {
        checkIn: Date | null;
        checkOut: Date | null;
      }[];
    } | null;
  }[];
};
