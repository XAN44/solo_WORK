"use client";
export const maxDuration = 60; // This function can run for a maximum of 5 seconds

import dynamic from "next/dynamic";
import LevelGate from "../../auth/Level-Gate";
import { UserLevel } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { FetchTeam, getProfileTeamById } from "../../../../actionAPi/fetch";
import { UseCurrentUser } from "../../../../hooks/use-curret-user";
import { ClipLoader } from "react-spinners";
import { preload } from "react-dom";

const Admin = dynamic(() => import("../../../components/ui/dashboard/admin"), {
  ssr: false,
});
const Attendence = dynamic(
  () => import("../../../components/ui/dashboard/attendence"),
  { ssr: false },
);
const YourProfile = dynamic(
  () => import("../../../components/ui/dashboard/Profile"),
  { ssr: false },
);
const ConfigSalary = dynamic(
  () => import("../../../components/ui/dashboard/configSalary"),
  { ssr: false },
);
const JoinTeam = dynamic(
  () => import("../../../components/ui/dashboard/joinTeam"),
  { ssr: false },
);

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

  const hasTeam = teamResponse && teamResponse;
  const isAdmin = user?.level === UserLevel.Admin; // ตรวจสอบว่าเป็นแอดมินหรือไม่

  return (
    <div className="h-full w-full">
      <div className="flex flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
        <LevelGate allowedLevel={UserLevel.Admin}>
          <Admin />
        </LevelGate>

        {hasTeam || isAdmin ? <Attendence /> : null}

        {hasTeam ? <YourProfile id={teamResponse?.id || ""} /> : null}

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
