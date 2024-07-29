import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../../components/ui/table";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import clsx from "clsx";
import { FetchAllTaskAndAtten } from "../../../../../../../data/fetch-taskAndAtten";
import ActionBtn_AllTask from "../../../../../../components/ui/profile/actionBtn";
import { FetchDataSumary } from "../../../../../../../data/fetch-Salary";
import SumaryTask from "../../../../../../components/ui/allTask/sumaryTask";

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
