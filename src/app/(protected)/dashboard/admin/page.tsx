export const maxDuration = 5; // This function can run for a maximum of 5 seconds

import React from "react";
import { GetMember } from "../../../../../data/fetch-member";
import { DepartMent } from "../../../../lib/select";
import { SelectSuperVisor } from "../../../../components/ui/admin/select_Supervisor";
import LevelGate from "../../../auth/Level-Gate";

async function Page() {
  return (
    <LevelGate allowedLevel="Admin">
      <div className="h-full w-full items-center justify-center">
        <div className="flex w-full flex-col">
          <SelectSuperVisor />
        </div>
      </div>
    </LevelGate>
  );
}

export default Page;
