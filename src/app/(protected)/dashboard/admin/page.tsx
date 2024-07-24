import React from "react";
import { GetMember } from "../../../../../data/fetch-member";
import { DepartMent } from "../../../../lib/select";
import { SelectSuperVisor } from "../../../../components/ui/admin/select_Supervisor";

async function Page() {
  return <SelectSuperVisor />;
}

export default Page;
