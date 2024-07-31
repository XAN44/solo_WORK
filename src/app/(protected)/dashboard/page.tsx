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

  return <div className="h-full w-full">{user?.username}</div>;
}

export default Page;
