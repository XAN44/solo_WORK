"use client";
import clsx from "clsx";
import { enUS } from "date-fns/locale";
import React from "react";
import ActionBtn_TimeOut from "../profile/actionSignOutBtn";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../table";
import { format } from "date-fns";
import { attendance } from "@prisma/client";
import { exportAttenToExcel } from "../../../lib/excelAtten";

type Props = {
  data: {
    id: string;
    dateIn: Date | null;
    dateOut: Date | null;
    type: string; // หรือเปลี่ยนเป็นประเภทที่เหมาะสม
    statusLeave: string | null;
  }[];
};

export default function AttenSumary({ data }: Props) {
  return (
    <div className="h-full w-full">
      <h1 className="text-xl font-bold">Summary of Attendance</h1>
      <div className="flex flex-col p-3">
        <button
          onClick={() => exportAttenToExcel(data)}
          className="mb-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Download as Excel
        </button>

        <Table>
          <TableCaption>A list of tasks and attendance</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Date Time In</TableHead>
              <TableHead>Date Time Out</TableHead>
              <TableHead>Attendance Status</TableHead>
              <TableHead>Status (leave request)</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((attendance, index) => (
              <TableRow key={attendance.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {attendance.dateIn
                    ? format(
                        new Date(attendance.dateIn),
                        "dd MMM yyyy HH:mm a",
                        { locale: enUS },
                      )
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {attendance.dateOut
                    ? format(
                        new Date(attendance.dateOut),
                        "dd MMM yyyy HH:mm a",
                        { locale: enUS },
                      )
                    : "N/A"}
                </TableCell>
                <TableCell
                  className={clsx({
                    "text-gray-500": attendance.type === "Leave",
                    "text-green-800": attendance.type === "Present",
                    "text-red-800": attendance.type === "Absent",
                    "text-yellow-500/100": attendance.type === "Late",
                  })}
                >
                  {attendance.type || "N/A"}
                </TableCell>
                <TableCell>
                  {attendance.statusLeave || "No LeaveRequest"}
                </TableCell>
                <TableCell>
                  <ActionBtn_TimeOut id={attendance.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
