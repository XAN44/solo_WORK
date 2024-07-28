import React from "react";
import { Button } from "../button";
import { TeamFull } from "../../../types/modal";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { format } from "date-fns";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import ActionBtn from "./actionBtn";

interface Data {
  isOpen: boolean;
  onClose: () => void;
  teams: TeamFull | null;
}

export default function DetalTabel({ isOpen, onClose, teams }: Data) {
  const handleClickBackgroundClose = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
      onClick={handleClickBackgroundClose}
    >
      <div className="relative h-1/2 w-1/2 bg-white">
        <Button
          className="absolute right-2 top-2"
          variant="ghost"
          onClick={onClose}
        >
          X
        </Button>
        <div className="h-full w-full">
          <div className="flex flex-col p-3">
            <h1>
              Team leader:
              {teams?.member.find((f) => f.isSupervisor)?.user?.username}
            </h1>
            <h1>Project:{teams?.project}</h1>
            <Table>
              <TableCaption>A list of your team</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>no</TableHead>
                  <TableHead>username</TableHead>
                  <TableHead>role</TableHead>
                  <TableHead>job</TableHead>
                  <TableHead>Time In</TableHead>
                  <TableHead>Time Out</TableHead>
                  <TableHead>action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams?.member.map((member, i) => (
                  <TableRow
                    key={member.user?.username}
                    className="hover:cursor-pointer hover:bg-violet-100"
                  >
                    <TableCell className="font-medium">{i + 1}</TableCell>
                    <TableCell>{member.user?.username}</TableCell>
                    <TableCell>{member.user?.role}</TableCell>
                    <TableCell>{member.user?.job}</TableCell>
                    <TableCell className="">
                      {member.user?.attendance &&
                      member.user.attendance.length > 0
                        ? member.user.attendance.map((att, j) => (
                            <div key={j}>
                              {att.checkIn
                                ? format(
                                    new Date(att.checkIn),
                                    "eeee 'at' h:mm",
                                  )
                                : "No Time In"}
                            </div>
                          ))
                        : "No Time In"}
                    </TableCell>
                    <TableCell>
                      {member.user?.attendance &&
                      member.user.attendance.length > 0
                        ? member.user.attendance.map((att, j) => (
                            <div key={j}>
                              {att.checkOut
                                ? format(
                                    new Date(att.checkOut),
                                    "eeee 'at' h:mm",
                                  )
                                : " No Time Out"}
                            </div>
                          ))
                        : "No Time Out"}
                    </TableCell>
                    <TableCell>
                      <ActionBtn id={member.user?.id || ""} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
