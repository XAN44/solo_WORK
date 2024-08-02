export const maxDuration = 60;
import React from "react";
import SumaryTask from "../../../../../../components/ui/allTask/sumaryTask";
import { FetchAllTaskAndAtten } from "../../../../../../../data/fetch-taskAndAtten";
import { FetchDataSumary } from "../../../../../../../data/fetch-Salary";

export default async function Page({ params }: { params: { id: string } }) {
  const [data, amount] = await Promise.all([
    FetchAllTaskAndAtten(params.id),
    FetchDataSumary(params.id),
  ]);

  if (!data) {
    return <div>No data found.</div>;
  }

  const amout = {
    totalAmount: amount.totalAmount, // Ensure this is correct
    tasks: data.task || [],
  };

  return <SumaryTask amout={amout} />;
}
