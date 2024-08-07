"use client";

import LevelGate from "../../auth/Level-Gate";
import { UserLevel } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { FetchTeam, getProfileTeamById } from "../../../../actionAPi/fetch";
import { UseCurrentUser } from "../../../../hooks/use-curret-user";
import { ClipLoader } from "react-spinners";
import { preload } from "react-dom";
import Admin from "../../../components/ui/dashboard/admin";
import Attendence from "../../../components/ui/dashboard/attendence";
import YourProfile from "../../../components/ui/dashboard/Profile";
import ConfigSalary from "../../../components/ui/dashboard/configSalary";
import JoinTeam from "../../../components/ui/dashboard/joinTeam";
import ChangeSupervisor from "../../../components/ui/dashboard/supervisorChange";

function Page() {
  const user = UseCurrentUser();

  const { data: teamResponse, isLoading } = useQuery({
    queryKey: ["teamResponse"],
    queryFn: FetchTeam,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <ClipLoader />
      </div>
    );
  }

  const hasTeam = teamResponse && teamResponse.id;
  const isAdmin = user?.level === UserLevel.Admin; // ตรวจสอบว่าเป็นแอดมินหรือไม่

  return (
    <div className="h-full w-full">
      <div className="flex flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
        <LevelGate allowedLevel={UserLevel.Admin}>
          <Admin />
        </LevelGate>
        <LevelGate allowedLevel={UserLevel.Admin}>
          <ChangeSupervisor />
        </LevelGate>

        {hasTeam || isAdmin ? <Attendence /> : null}

        {hasTeam ? <YourProfile id={teamResponse.id} /> : null}

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
