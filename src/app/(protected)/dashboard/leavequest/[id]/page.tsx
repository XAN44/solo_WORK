export const maxDuration = 60; // This function can run for a maximum of 5 seconds

import { redirect } from "next/navigation";
import LeaverequestBySupervisor from "../../../../../components/ui/requestLeave/leaverequest";
import { useCurrentLevel } from "../../../../../lib/auth";
import { FetchRequestLeave } from "../../../../../../data/fetch-requestLeave";
import LevelGate from "../../../../auth/Level-Gate";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await FetchRequestLeave(params.id);

  if (!data) {
    return redirect("/dashboard");
  }

  return (
    <div>
      <LeaverequestBySupervisor
        id={data?.id || ""}
        title={data?.title || ""}
        leaveDateEnd={data?.dateIn || new Date()}
        leaveDateStart={data?.dateOut || new Date()}
        reason={data?.reason || ""}
        tel={data?.tel || ""}
        username={data?.teamMember?.user?.username || ""}
        typeleave={data?.typeleave || ""}
        first_name={data?.teamMember?.user?.first_name || ""}
        last_name={data?.teamMember?.user?.last_name || ""}
        status={data?.statusLeave || ""}
      />
    </div>
  );
}
