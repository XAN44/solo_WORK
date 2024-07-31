export const maxDuration = 60; // This function can run for a maximum of 5 seconds

import dynamic from "next/dynamic";
import LevelGate from "../../auth/Level-Gate";
import { UserLevel } from "@prisma/client";
import { FetchTeam } from "../../../../data/fetchTeam-CLoseJoin";
import { getProfileTeamById } from "../../../../data/user";
import { currentUser } from "../../../lib/auth";

const Admin = dynamic(() => import("../../../components/ui/dashboard/admin"));
const Attendence = dynamic(
  () => import("../../../components/ui/dashboard/attendence"),
);
const YourProfile = dynamic(
  () => import("../../../components/ui/dashboard/Profile"),
);
const ConfigSalary = dynamic(
  () => import("../../../components/ui/dashboard/configSalary"),
);
const JoinTeam = dynamic(
  () => import("../../../components/ui/dashboard/joinTeam"),
);

async function Page() {
  const user = await currentUser();
  const data = await getProfileTeamById(user?.id || "");
  const teamResponse = await FetchTeam();

  const hasTeam = teamResponse && teamResponse.success;
  const isAdmin = user?.level === UserLevel.Admin; // ตรวจสอบว่าเป็นแอดมินหรือไม่

  return (
    <div className="h-full w-full">
      <div className="flex flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
        <LevelGate allowedLevel={UserLevel.Admin}>
          <Admin />
        </LevelGate>

        {hasTeam || isAdmin ? <Attendence /> : null}

        {data?.id ? <YourProfile id={data?.id || ""} /> : null}

        <LevelGate allowedLevel={UserLevel.Admin}>
          <ConfigSalary />
        </LevelGate>

        {!hasTeam && (
          <LevelGate allowedLevel={UserLevel.General}>
            <div className=" ">
              <h1 className="mb-3">
                You don’t have a team yet. Make a team selection to display
                additional content.
              </h1>
              <JoinTeam />
            </div>
          </LevelGate>
        )}
      </div>
    </div>
  );
}

export default Page;
