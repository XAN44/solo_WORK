"use client";
export const maxDuration = 60; // This function can run for a maximum of 5 seconds

import React from "react";

import { SelectSuperVisor } from "../../../../components/ui/admin/select_Supervisor";
import LevelGate from "../../../auth/Level-Gate";

function Page() {
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
