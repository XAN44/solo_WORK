import React from "react";
import { Button } from "../button";
import { TeamFull } from "../../../types/modal";

interface Data {
  isOpen: boolean;
  onClose: () => void;
  teams: TeamFull[];
}

export default function DetalTabel({ isOpen, onClose, teams }: Data) {
  const handleClickBackgroundClose = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
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
      </div>
    </div>
  );
}
