import React from "react";
import { Form } from "../../../components/ui/form";
import { SelectSupervisor } from "../../../../data/select";
import { getProfileTeamById, getUserByUsername } from "../../../../data/user";
import Admin from "../../../components/ui/dashboard/admin";
import LevelGate from "../../auth/Level-Gate";
import { UserLevel } from "@prisma/client";
import { MyTeam } from "../../../components/ui/dashboard/myteam";
import Attendence from "../../../components/ui/dashboard/attendence";
import YourProfile from "../../../components/ui/dashboard/Profile";
import { currentUser } from "../../../lib/auth";
import ConfigSalary from "../../../components/ui/dashboard/configSalary";
import CheckAbset from "../../../components/ui/dashboard/checkAbset";
import JoinTeam from "../../../components/ui/dashboard/joinTeam";
import { FetchTeam } from "../../../../data/fetchTeam-CLoseJoin";

async function Page() {
  const user = await currentUser();
  const data = await getProfileTeamById(user?.id || "");
  const userTeamMembership = await FetchTeam();

  return (
    <div className="h-full w-full">
      <div className="flex flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
        <LevelGate allowedLevel={UserLevel.Admin}>
          <Admin />
        </LevelGate>
        <Attendence />

        <YourProfile id={data?.id || ""} />

        <LevelGate allowedLevel={UserLevel.Admin}>
          <ConfigSalary />
        </LevelGate>
        <LevelGate allowedLevel={UserLevel.General}>
          {userTeamMembership ? null : <JoinTeam />}
        </LevelGate>
      </div>
    </div>
  );
}

export default Page;
