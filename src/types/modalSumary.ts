import {
  attendance,
  task,
  teamMember,
  UserLevel,
  UserRole,
} from "@prisma/client";

export type DataModal = teamMember & {
  task: task[];
  attendance: attendance[];
};

export interface User {
  id: string;
  username: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: UserRole | null; // Allow null here
  level: UserLevel | null; // Allow null here
  job: string | null;
  department: string | null;
}
