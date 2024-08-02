export const maxDuration = 60;
import React from "react";

import SumaryTask from "../../../../../../components/ui/allTask/sumaryTask";
import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "../../../../../../../actionAPi/fetch";
import { ClipLoader } from "react-spinners";
import { FetchAllTaskAndAtten } from "../../../../../../../data/fetch-taskAndAtten";
import { FetchDataSumary } from "../../../../../../../data/fetch-Salary";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await FetchAllTaskAndAtten(params.id);
  const amount = await FetchDataSumary(params.id);
  if (!data) {
    return <div>No data found.</div>;
  }

  const amout = {
    totalAmount: amount.totalAmount, // Ensure this is correct
    tasks: data.task || [],
  };
  return <SumaryTask amout={amout} />;
}
