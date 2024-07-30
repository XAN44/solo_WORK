"use server";

import { Attendance } from "@prisma/client";
import { db } from "../src/lib/db";
import {
  isBefore,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns";
import { sendMailWithTimeIn } from "../src/lib/sendMail_TimeIn";
import { GetAdminByTeamId, GetSupervisorById } from "../data/supervisor";
import { auth } from "../auth";
import { getUserById } from "../data/user";
import { GetAdminInTeam, GetTeamById } from "../data/team";
import { SiCucumber } from "react-icons/si";
import { sendMailWithTimeInSupervisor } from "../src/lib/sendMail_SupervisorTimeIn";

export async function createAttendence(teamMemberId: string, dateIn: Date) {
  const user = await auth();
  const today = new Date();

  const nineAm = setHours(
    setMinutes(setSeconds(setMilliseconds(today, 0), 0), 0),
    9,
  );
  // TODO ถ้าลงชื่อหลังจาก 9:00 ถือว่ามาสาย
  const type = dateIn > nineAm ? Attendance.Late : Attendance.Present;

  await db.attendance.create({
    data: {
      teamMemberId,
      dateIn,
      type,
    },
  });

  const isSupervisor = await db.teamMember.findFirst({
    where: {
      userId: teamMemberId,
    },
    select: {
      isSupervisor: true,
    },
  });

  const userData = await getUserById(user?.user.id || "");
  const teamData = await GetTeamById(user?.user.id || "");
  const supervisorEmail = await GetSupervisorById(user?.user.id || "");
  const adminEmail = await GetAdminInTeam(user?.user.id || "");

  if (!isSupervisor?.isSupervisor && adminEmail) {
    await sendMailWithTimeIn(
      supervisorEmail?.email || "",
      userData?.role || "",
      userData?.job || "",
      userData?.first_name || "",
      userData?.last_name || "",
      userData?.department || "",
      teamData?.project || "",
      dateIn,
    );
  }

  return;
}
