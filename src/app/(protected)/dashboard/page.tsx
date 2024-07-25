import React from "react";
import { Form } from "../../../components/ui/form";
import { SelectSupervisor } from "../../../../data/select";
import { getUserByUsername } from "../../../../data/user";
import Admin from "../../../components/ui/dashboard/admin";
import LevelGate from "../../auth/Level-Gate";
import { UserLevel } from "@prisma/client";
import { MyTeam } from "../../../components/ui/dashboard/myteam";

async function Page() {
  return (
    <div className="h-full w-full">
      <div className="flex flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
        <LevelGate allowedLevel={UserLevel.Admin}>
          <Admin />
        </LevelGate>
        <MyTeam />
      </div>
    </div>
  );
}

export default Page;
