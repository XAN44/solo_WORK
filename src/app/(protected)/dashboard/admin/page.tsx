import React from "react";
import { GetMember } from "../../../../../data/fetch-member";
import { DepartMent } from "../../../../lib/select";
import { SelectSuperVisor } from "../../../../components/ui/admin/select_Supervisor";

async function Page() {
  return (
    <div className="h-full w-full items-center justify-center">
      <div className="flex w-full flex-col">
        <SelectSuperVisor />
      </div>
    </div>
  );
}

export default Page;
