import { FetchTeam } from "../../../../../data/fetch-team";

import TabelTeam from "../../../../components/ui/myteam/tabelTeam";

export default async function Page() {
  const teams = await FetchTeam();
  if (!teams) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        You dont have team
      </div>
    );
  }
  return <TabelTeam teams={teams} />;
}
