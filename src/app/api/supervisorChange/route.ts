import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function POST(request: Request) {
  const { currentSupervisorId, newSupervisorId } = await request.json();

  try {
    // ค้นหาทีมที่ Supervisor ปัจจุบันเป็นสมาชิก
    const currentSupervisorTeamMembers = await db.teamMember.findMany({
      where: { userId: currentSupervisorId },
    });

    if (currentSupervisorTeamMembers.length === 0) {
      return NextResponse.json(
        { error: "Supervisor not found in any team" },
        { status: 404 },
      );
    }

    // ดึงรายการ teamId ที่ Supervisor ปัจจุบันเป็นสมาชิกและกรองค่า null
    const teamIds = currentSupervisorTeamMembers
      .map((member) => member.teamId)
      .filter((teamId): teamId is string => teamId !== null);

    if (teamIds.length === 0) {
      return NextResponse.json(
        { error: "No valid team IDs found" },
        { status: 404 },
      );
    }

    // อัปเดตสถานะ Supervisor ปัจจุบันให้เป็น General
    await db.teamMember.updateMany({
      where: {
        teamId: { in: teamIds },
        userId: currentSupervisorId,
      },
      data: {
        isSupervisor: false,
      },
    });

    // อัปเดตสถานะ Supervisor ใหม่ให้เป็น Supervisor ในทีมเดียวกัน
    await db.teamMember.updateMany({
      where: {
        teamId: { in: teamIds },
        userId: newSupervisorId,
      },
      data: {
        isSupervisor: true,
      },
    });

    // อัปเดตข้อมูลใน user ของ Supervisor ใหม่
    await db.user.update({
      where: { id: newSupervisorId },
      data: { level: "Supervisor" },
    });

    // อัปเดตข้อมูลใน user ของ Supervisor ปัจจุบัน
    await db.user.update({
      where: { id: currentSupervisorId },
      data: { level: "General" }, // หรือสถานะอื่นที่ต้องการ
    });

    // ดึง userId ของสมาชิกทั้งหมดในทีมที่เกี่ยวข้องและกรองค่า null
    const userIds = await db.teamMember
      .findMany({
        where: { teamId: { in: teamIds } },
        select: { userId: true },
      })
      .then((members) =>
        members
          .map((member) => member.userId)
          .filter((userId): userId is string => userId !== null),
      );

    // อัปเดต supervisorId ของผู้ใช้ทั้งหมดในทีมให้เป็น Supervisor ใหม่
    await db.user.updateMany({
      where: {
        id: { in: userIds },
        NOT: {
          id: newSupervisorId, // ยกเว้น Supervisor ใหม่
        },
      },
      data: {
        supervisorId: newSupervisorId,
      },
    });

    // ตั้งค่า supervisorId ของ Supervisor ใหม่ให้เป็น null
    await db.user.update({
      where: { id: newSupervisorId },
      data: {
        supervisorId: null,
      },
    });

    return NextResponse.json({ message: "Supervisor updated successfully" });
  } catch (error) {
    console.error("Error updating supervisor:", error);
    return NextResponse.json(
      { error: "Error updating supervisor" },
      { status: 500 },
    );
  }
}
