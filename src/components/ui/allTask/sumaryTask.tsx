"use client";
import React from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import clsx from "clsx";
import ActionBtn_AllTask from "../profile/actionBtn";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../table";
import { task } from "@prisma/client";
import { exportTasksToExcel } from "../../../lib/excel";
import { UseCurrentUser } from "../../../../hooks/use-curret-user";

interface Props {
  amout: {
    totalAmount: number;
    tasks: task[];
  };
}

export default function SummaryTask({ amout }: Props) {
  return (
    <div className="h-full w-full">
      <h1 className="text-xl font-bold">Summary of Tasks</h1>
      <div className="flex flex-col p-3">
        <button
          onClick={() => exportTasksToExcel(amout.tasks)}
          className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Download as Excel
        </button>

        <Table>
          <TableCaption>
            <p>A list of tasks</p>
            <p>{amout.totalAmount} Bath</p>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type of Work</TableHead>
              <TableHead>Task CreateAt</TableHead>
              <TableHead>Task Start</TableHead>
              <TableHead>Task End At</TableHead>
              <TableHead>Task Status</TableHead>
              <TableHead>Task Type</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amout.tasks.map((task, index) => (
              <TableRow key={task.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.typeOfWork}</TableCell>
                <TableCell>
                  {format(new Date(task.dateCreateAt), "dd MMM yyyy HH:mm a", {
                    locale: enUS,
                  })}
                </TableCell>
                <TableCell>
                  {format(new Date(task.startAt), "dd MMM yyyy HH:mm a", {
                    locale: enUS,
                  })}
                </TableCell>
                <TableCell>
                  {format(new Date(task.endAt), "dd MMM yyyy HH:mm a", {
                    locale: enUS,
                  })}
                </TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell
                  className={clsx({
                    "text-red-500": task.createAt === "Backdate",
                    "text-green-500": task.createAt === "Normal",
                  })}
                >
                  {task.createAt}
                </TableCell>
                <TableCell>
                  <ActionBtn_AllTask id={task.id!} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
