export const maxDuration = 60;
import React from "react";
import SumaryTask from "../../../../../../components/ui/allTask/sumaryTask";
import { FetchDataSumary } from "../../../../../../../data/fetch-Salary";
import { FetchAllTaskk } from "../../../../../../../data/fetch-taskAndAtten";
import { UseCurrentUser } from "../../../../../../../hooks/use-curret-user";
import { currentUser } from "../../../../../../lib/auth";
import {
  fetchMemberId,
  fetchTeams,
} from "../../../../../../../actionAPi/fetch";
import { FetchMemberTeam } from "../../../../../../../data/fetchTeamMember";

export default async function Page({ params }: { params: { id: string } }) {
  const [data, amount] = await Promise.all([
    FetchAllTaskk(params.id),
    FetchDataSumary(params.id),
  ]);

  if (!data) {
    return <div>No data found.</div>;
  }
  const currentUsers = await currentUser(); // Fetch current user
  const currentUserId = currentUsers?.id || "";
  const memberId = await FetchMemberTeam(params.id);
  const amout = {
    totalAmount: amount.totalAmount, // Ensure this is correct
    tasks: data.task || [],
    memberId: memberId,
  };

  return <SumaryTask amout={amout} currentUserId={currentUserId} />;
}
