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

        {/* แสดง Attendence สำหรับผู้ที่มีทีมและแอดมิน */}
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
