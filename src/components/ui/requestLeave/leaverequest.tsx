"use client";
import { Button } from "../button";
import FormApprove from "../profile/Formpprove";
interface ShowTogle {
  id: string;
  title: string;
  reason: string;
  tel: string;
  leaveDateStart: Date;
  leaveDateEnd: Date;
  username: string;
  typeleave: string;
  first_name: string;
  last_name: string;
  status: string;
}

export default function TogleRequestLeave({
  id,
  title,
  leaveDateEnd,
  leaveDateStart,
  reason,
  tel,
  username,
  typeleave,
  first_name,
  last_name,
  status,
}: ShowTogle) {
  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-full w-full overflow-y-auto rounded-xl bg-white md:h-[490px] md:w-[500px]">
        <div className="h-full w-full">
          <FormApprove
            id={id}
            leaveDateEnd={leaveDateEnd}
            status={status}
            leaveDateStart={leaveDateStart}
            reason={reason}
            tel={tel}
            title={title}
            username={username}
            typeleave={typeleave}
            first_name={first_name}
            last_name={last_name}
          />
        </div>
      </div>
    </div>
  );
}
