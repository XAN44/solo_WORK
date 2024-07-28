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
import { FetchAllTask } from "../../../../../../../data/fetch-taskAndAtten";
import ActionBtn_AllTask from "../../../../../../components/ui/allTask/actionBtn";
import { currentUser, useCurrentLevel } from "../../../../../../lib/auth";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await FetchAllTask(params.id);

  const Level = await useCurrentLevel();

  if (!data) {
    return <div>No data found.</div>;
  }

  return (
    <div className="h-full w-full">
      <h1 className="text-xl font-bold">Summary of Tasks</h1>
      <div className="flex flex-col p-3">
        <Table>
          <TableCaption>A list of tasks and attendance</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type of Work</TableHead>
              <TableHead>Task Start </TableHead>
              <TableHead>Task End At ( expected to be finished)</TableHead>
              <TableHead>Task Status</TableHead>
              <TableHead>Task Type</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((task, index) => (
              <TableRow key={task.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.typeOfWork}</TableCell>

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
                  <ActionBtn_AllTask id={task.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
