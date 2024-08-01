"use client";
import { useQuery } from "@tanstack/react-query";
import { FetchTeam } from "../../../../../data/fetch-team";

import TabelTeam from "../../../../components/ui/myteam/tabelTeam";
import { fetchTeams } from "../../../../../actionAPi/fetchTeam";
import { Skeleton } from "../../../../components/ui/skeleton";
import { ClipLoader } from "react-spinners";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: fetchTeams,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <ClipLoader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        You dont have team
      </div>
    );
  }
  return <TabelTeam teams={data!} />;
}
