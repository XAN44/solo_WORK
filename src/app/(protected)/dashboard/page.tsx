import React from "react";

import { getProfileTeamById } from "../../../../data/user";
import Admin from "../../../components/ui/dashboard/admin";
import LevelGate from "../../auth/Level-Gate";
import { UserLevel } from "@prisma/client";
import Attendence from "../../../components/ui/dashboard/attendence";
import YourProfile from "../../../components/ui/dashboard/Profile";
import { currentUser } from "../../../lib/auth";
import ConfigSalary from "../../../components/ui/dashboard/configSalary";
import JoinTeam from "../../../components/ui/dashboard/joinTeam";
import { FetchTeam } from "../../../../data/fetchTeam-CLoseJoin";
import { getTeams } from "../../../../action/create-joinTeam";
import { useQuery } from "@tanstack/react-query";

async function Page() {
  const user = await currentUser();
  const data = await getProfileTeamById(user?.id || "");
  const userTeamMembership = await FetchTeam();
  const team = await getTeams();

  return (
    <div className="h-full w-full">
      <div className="flex flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
        <LevelGate allowedLevel={UserLevel.Admin}>
          <Admin />
        </LevelGate>
        {userTeamMembership ? <Attendence /> : null}
        <LevelGate allowedLevel={UserLevel.Admin}>
          <Attendence />
        </LevelGate>
        {data?.id ? (
          <>
            <YourProfile id={data?.id || ""} />
          </>
        ) : null}

        <LevelGate allowedLevel={UserLevel.Admin}>
          <ConfigSalary />
        </LevelGate>
      </div>
    </div>
  );
}

export default Page;
