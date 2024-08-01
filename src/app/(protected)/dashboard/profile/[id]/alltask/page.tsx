"use client";
import React from "react";

import SumaryTask from "../../../../../../components/ui/allTask/sumaryTask";
import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "../../../../../../../actionAPi/fetch";
import { ClipLoader } from "react-spinners";

export default function Page({ params }: { params: { id: string } }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["AllTask", params.id],
    queryFn: () => fetchTasks(params.id),
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ClipLoader />
      </div>
    );
  }
  if (error || !data) {
    return <div>No data found.</div>;
  }

  const amout = {
    totalAmount: data.totalAmount || 0, // Ensure this is correct
    tasks: data.tasks || [],
  };

  return <SumaryTask amout={amout} />;
}
