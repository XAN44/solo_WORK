import { format } from "date-fns";
import { FetchTeam } from "../../../../../data/fetch-team";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import TabelTeam from "../../../../components/ui/myteam/tabelTeam";

export default async function Page({}) {
  const teams = await FetchTeam();
  if (!teams) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        You dont have a team yet.
      </div>
    );
  }
  return <TabelTeam teams={teams} />;
}
