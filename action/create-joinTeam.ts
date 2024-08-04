"use server";

import { z } from "zod";
import { db } from "../src/lib/db";
import { JoinTeam } from "../schema/validateJoinTeam";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";

export async function getTeams() {
  return db.team.findMany({
    include: {
      member: {
        where: { isSupervisor: true },
        include: {
          user: true,
        },
      },
    },
  });
}

export async function JoinTeamAction(value: z.infer<typeof JoinTeam>) {
  const validate = JoinTeam.safeParse(value);
  const user = await auth();

  if (!validate.success) {
    return { error: "Validate Field" };
  }
  const { id } = validate.data;

  //   TODO : ค้นหาว่าผู้ใช้มีทีมแล้วหรือยัง
  const userTeamMembership = await db.teamMember.findFirst({
    where: {
      userId: user?.user.id,
    },
  });

  if (userTeamMembership) {
    return { error: `You have already joined a team` };
  }

  //   TODO : ค้นหาว่ามี Supervisor หรือไม่
  const supervisor = await db.user.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
    },
  });

  if (!supervisor) {
    return { error: "Supervisor not found" };
  }
  // TODO : ค้นหาว่ามีทีมที่มี Supervisor ที่เราค้นหาอยู่ในทีมไหนบ้าง
  const team = await db.team.findFirst({
    where: {
      member: {
        some: {
          userId: supervisor?.id,
          isSupervisor: true,
        },
      },
    },
  });

  if (!team) {
    return { error: "Team of the selected supervisor not found" };
  }

  //   TODO : เข้าร่วมทีมโดยมีเงื่อนไขก็คือ ใช้ผู้ใช้ที่ login อยู่และ TeamId ที่มี supervisor คนนั้นอยู่ และกำหนดว่าฟิลด์ที่สร้างใหม่ต้องไม่เป็น IsSuperviSor
  const joinTeam = await db.teamMember.create({
    data: {
      userId: user?.user.id,
      teamId: team.id,
      isSupervisor: false,
    },
  });

  //   TODO : ถ้าเข้าร่วมสำเร็จ จะทำการอัพเดทข้อมูลของผู้ที่ login และทำการเป็น member ร่วมกับ supervisor คนดังกล่าว

  if (joinTeam) {
    await db.user.update({
      where: {
        id: user?.user.id,
      },
      data: {
        supervisorId: supervisor?.id,
      },
    });
  }

  revalidatePath("/");
  return { success: "Successfully joined as a member within the team" };
}
