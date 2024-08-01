"use client";
import { auth } from "../../../../../../auth";
import StartWork from "../../../../../components/ui/profile/startWork";
import LeaveRequest from "../../../../../components/ui/profile/leaveRequest";
import AllWork from "../../../../../components/ui/profile/AllWork";
import AllAttendance from "../../../../../components/ui/profile/AllAttendance";
import { useQuery } from "@tanstack/react-query";
import { fetchMemberId } from "../../../../../../actionAPi/fetch";
import { ClipLoader } from "react-spinners";
import { UseCurrentUser } from "../../../../../../hooks/use-curret-user";

export default function Page({ params }: { params: { id: string } }) {
  // ดึงข้อมูลผู้ใช้ที่เป็นหน้าโปรไฟล์

  const { data, isLoading, error } = useQuery({
    queryKey: ["Profile", params.id],
    queryFn: () => fetchMemberId(params.id),
  });

  if (error) {
    return <>{error}</>;
  }

  const current = UseCurrentUser();
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ClipLoader />
      </div>
    );
  }

  // ดึงข้อมูลผู้ใช้ที่เข้าสู่ระบบ
  if (!current) {
    return <div>Unauthorized</div>;
  }
  console.log("Data from API:", data);

  const isAdmin = current.level === "Admin";
  const isSupervisorOfMember = data?.user?.user?.supervisorId === current.id;
  const isProfileOwner = current.id === data?.userId;

  console.log(isProfileOwner);

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
            <AllWork id={data.id} />
          </div>
          <AllAttendance id={data.id} />
        </div>
      </div>
    </div>
  );
}
