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
import { FetchAllAtten } from "../../../../../../../data/fetch-taskAndAtten";

export default async function Page({ params }: { params: { id: string } }) {
  const data = await FetchAllAtten(params.id);

  if (!data) {
    return <div>No data found.</div>;
  }

  return (
    <div className="h-full w-full">
      <h1 className="text-xl font-bold">Summary of Attendance </h1>
      <div className="flex flex-col p-3">
        <Table>
          <TableCaption>A list of tasks and attendance</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Date Time In</TableHead>
              <TableHead>Date Time Out</TableHead>
              <TableHead>Attendance Status</TableHead>
              <TableHead>Status (leave request)</TableHead>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
