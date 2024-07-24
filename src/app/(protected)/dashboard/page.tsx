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
    <div className="flex h-full w-full items-start justify-start">
      <LevelGate allowedLevel={UserLevel.Admin}>
        <Admin />
      </LevelGate>
      <MyTeam />
    </div>
  );
}

export default Page;
