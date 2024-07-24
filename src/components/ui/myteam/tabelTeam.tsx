"use client";
import { format } from "date-fns";
import { FetchTeam } from "../../../../data/fetch-team";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { useState } from "react";
import { TeamFull } from "../../../types/modal";
import DetalTabel from "./detalTabel";

interface Team {
  teams: TeamFull[];
}

export default function TabelTeam({ teams }: Team) {
  const [popupData, setPopupdata] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = (data: any) => {
    setIsOpen(true);
    setPopupdata(data);
  };

  const handleClose = () => {
    setIsOpen(false);
    setPopupdata(null);
  };

  if (!teams) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        You dont have a team yet.
      </div>
    );
  }
  return (
    <div className="h-full w-full">
      <Table>
        <TableCaption>A list of your team</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>no</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead>Members</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((data, i) => (
            <TableRow
              key={data.project}
              onClick={() => handleOpen(data)}
              className="hover:bg-violet-100"
            >
              <TableCell className="font-medium">{i}</TableCell>
              <TableCell>{data.project}</TableCell>
              <TableCell>{data.department}</TableCell>
              <TableCell>
                {format(new Date(data.startAt), "yyyy-MM-dd  HH:mm")}
              </TableCell>
              <TableCell>
                {format(new Date(data.endAt), "yyyy-MM-dd HH:mm")}
              </TableCell>
              <TableCell>
                {data.member.find((d) => d.isSupervisor)?.user?.username}
              </TableCell>
              <TableCell>{data.member.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isOpen && (
        <DetalTabel isOpen={isOpen} onClose={handleClose} teams={teams} />
      )}
    </div>
  );
}
