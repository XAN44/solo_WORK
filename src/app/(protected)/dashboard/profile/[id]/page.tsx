export const maxDuration = 5; // This function can run for a maximum of 5 seconds

import { auth } from "../../../../../../auth";
import { getMemberById } from "../../../../../../data/user";
import StartWork from "../../../../../components/ui/profile/startWork";
import LeaveRequest from "../../../../../components/ui/profile/leaveRequest";
import AllWork from "../../../../../components/ui/profile/AllWork";
import AllAttendance from "../../../../../components/ui/profile/AllAttendance";
import { Button } from "../../../../../components/ui/button";

export default async function Page({ params }: { params: { id: string } }) {
  // ดึงข้อมูลผู้ใช้ที่เป็นหน้าโปรไฟล์
  const member = await getMemberById(params.id);
  if (!member) {
    return <div>Member not found</div>;
  }

  // ดึงข้อมูลผู้ใช้ที่เข้าสู่ระบบ
  const current = await auth();
  if (!current?.user) {
    return <div>Unauthorized</div>;
  }

  // ตรวจสอบบทบาทของผู้ใช้ที่เข้าสู่ระบบ
  const isAdmin = current.user.level === "Admin"; // ตรวจสอบว่าเป็นแอดมิน
  const isSupervisorOfMember = member.user?.supervisorId === current.user.id; // ตรวจสอบว่าผู้ใช้เป็นหัวหน้างานของสมาชิก
  const isProfileOwner = current.user.id === member.userId; // ตรวจสอบว่าเป็นเจ้าของโปรไฟล์

  // ตรวจสอบสิทธิ์การเข้าถึง
  if (!isAdmin && !isSupervisorOfMember && !isProfileOwner) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="grid h-full w-full">
      <div className="flex">
        {isProfileOwner && (
          <div className="flex flex-col">
            <div className="flex md:ml-6">
              <StartWork />
            </div>
            <div className="mt-6 md:ml-6">
              <LeaveRequest />
            </div>
          </div>
        )}
        <div className="ml-6">
          <div className="mb-6">
            <AllWork id={member.id || ""} />
          </div>
          <AllAttendance id={member.id || ""} />
        </div>
      </div>
    </div>
  );
}
