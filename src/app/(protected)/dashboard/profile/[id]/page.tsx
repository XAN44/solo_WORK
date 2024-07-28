import { format } from "date-fns";
import { auth } from "../../../../../../auth";
import { FetchTask } from "../../../../../../data/fetch-task";
import { getUserById } from "../../../../../../data/user";
import LeaveRequest from "../../../../../components/ui/profile/leaveRequest";
import StartWork from "../../../../../components/ui/profile/startWork";
import { getAttendance } from "../../../../../../data/fetch-attendance";
import { toZonedTime, format as formatZoned } from "date-fns-tz";
import AllWork from "../../../../../components/ui/profile/AllWork";

import AllAttendance from "../../../../../components/ui/profile/AllAttendance";

export default async function Page({ params }: { params: { id: string } }) {
  // TODO : ดึงข้อมูลผู้ใช้ที่เป็นหน้าโปรไฟล์
  const user = await getUserById(params.id);
  //   TODO : ดึงข้อมูลผู้ใช้ที่ได้เข้าสู่ระบบ
  const current = await auth();
  const isOwner = current?.user.id === user?.id;

  return (
    <div className="w- grid h-full">
      <div className="flex">
        {isOwner && (
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
            <AllWork id={user?.id || ""} />
          </div>
          <AllAttendance id={user?.id || ""} />
        </div>
      </div>
    </div>
  );
}
