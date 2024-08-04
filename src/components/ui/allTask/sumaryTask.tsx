"use client";
import React, { useState } from "react";
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
import { Button } from "../button";
import EditTaskModal from "../profile/editTask";

interface Props {
  amout: {
    totalAmount: number;
    tasks: task[];
    memberId: string;
  };
  currentUserId: string;
}

export default function SummaryTask({ amout, currentUserId }: Props) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleEditTask = (taskId: string) => {
    setEditingTaskId(taskId);
  };

  const handleCloseModal = () => {
    setEditingTaskId(null);
  };

  const [currentTask, setCurrentTask] = useState<{
    title: string;
    description: string;
  } | null>(null);

  return (
    <div className="h-full w-full">
      <h1 className="text-xl font-bold">Summary of Tasks</h1>
      <div className="flex flex-col p-3">
        <button
          onClick={() => exportTasksToExcel(amout.tasks, amout.totalAmount)}
          className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Download as Excel
        </button>

        <Table>
          <TableCaption>
            <p>A list of tasks</p>
            <p>{amout.totalAmount} Baht</p>
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
                  {amout.memberId === currentUserId && (
                    <Button
                      onClick={() => handleEditTask(task.id!)}
                      className="ml-2 bg-green-500 text-white"
                    >
                      Edit Task
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {editingTaskId && (
          <EditTaskModal
            taskId={editingTaskId}
            onClose={handleCloseModal}
            descriptTion={
              amout.tasks.find((task) => task.id === editingTaskId)
                ?.description || ""
            }
            title={
              amout.tasks.find((task) => task.id === editingTaskId)?.title || ""
            }
          />
        )}
      </div>
    </div>
  );
}
