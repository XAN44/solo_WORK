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

  // ตรวจสอบและจัดเตรียมข้อมูลของ user

  return (
    <div>
      <LevelGate allowedLevel="Supervisor">
        <LeaverequestBySupervisor
          id={data?.id || ""}
          title={data?.title || ""}
          leaveDateEnd={data?.dateIn || new Date()}
          leaveDateStart={data?.dateOut || new Date()}
          reason={data?.reason || ""}
          tel={data?.tel || ""}
          username={data?.user.username || ""}
          typeleave={data.typeleave || ""}
          first_name={data.user.first_name || ""}
          last_name={data.user.last_name || ""}
          status={data.statusLeave || ""}
        />
      </LevelGate>
    </div>
  );
}
