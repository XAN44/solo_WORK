import React from "react";
import { TeamFull } from "../../../types/modal";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { SiQuicklook } from "react-icons/si";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { GrTasks } from "react-icons/gr";

interface Model {
  id: string;
}

export default function ActionBtn({ id }: Model) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <SiQuicklook className="text-blue-800" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col space-y-6">
          <Link
            href={`/dashboard/profile/${id}`}
            className="text-blue-600 hover:underline"
          >
            <div className="flex items-center justify-center space-x-2">
              <h1>View profile</h1>
              <CgProfile />
            </div>
          </Link>
          <Link
            href={`/dashboard/profile/${id}/alltask`}
            className="text-blue-600 hover:underline"
          >
            <div className="flex items-center justify-center space-x-2">
              <h1>View summary</h1>
              <GrTasks />
            </div>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
