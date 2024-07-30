"use server";

import { Attendance } from "@prisma/client";
import { db } from "../src/lib/db";
import { setHours, setMilliseconds, setMinutes, setSeconds } from "date-fns";
import { sendMailWithTimeIn } from "../src/lib/sendMail_TimeIn";
import { GetAdminByTeamId, GetSupervisorById } from "../data/supervisor";
import { auth } from "../auth";
import { getUserById } from "../data/user";
import { GetTeamById } from "../data/team";

export async function createAttendence(teamMemberId: string, dateIn: Date) {
  const user = await auth();
  const today = new Date();

  const nineAm = setHours(
    setMinutes(setSeconds(setMilliseconds(today, 0), 0), 0),
    9,
  );
  const type = dateIn > nineAm ? Attendance.Late : Attendance.Present;

  const data = await db.attendance.create({
    data: {
      teamMemberId,
      dateIn,
      type,
    },
  });

  const userData = await getUserById(user?.user.id || "");
  const teamData = await GetTeamById(user?.user.id || "");
  const adminEmail = teamData?.admin?.email || "";

  await sendMailWithTimeIn(
    adminEmail,
    userData?.role || "",
    userData?.job || "",
    userData?.first_name || "",
    userData?.last_name || "",
    userData?.department || "",
    teamData?.project || "",
    dateIn,
  );

  return;
}
