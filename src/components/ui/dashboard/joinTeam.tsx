"use client";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { motion } from "framer-motion";
import { Button } from "../button";
import TogleStartTask from "../profile/togleShowStartTask";
import ConfgigStartSalary from "./togleStartConfigSalary";
import ShowTeamForJoin from "./togleShowTeam";

type User = {
  id: string;
  username: string | null;
  email: string | null;
  emailVerified: Date | null;
  password: string | null;
  image: string | null;
  first_name: string | null;
  last_name: string | null;
};

type TeamMember = {
  user: User | null;
};

interface Team {
  id: string;
  department: string;
  project: string;
  member: TeamMember[];
}

interface FormJoinTeamProps {
  team: Team[]; // เปลี่ยนชื่อจาก Team เป็น team เพื่อหลีกเลี่ยงการสับสน
}
export default function JoinTeam({ team }: FormJoinTeamProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="flex h-60 w-60 items-center justify-center rounded-2xl border ring-1 ring-black hover:cursor-pointer"
        onClick={handleOpen}
      >
        <motion.div
          whileHover={{
            scale: 1.1,
            transition: { duration: 0.5 },
          }}
          className="flex h-full w-full flex-col items-center justify-center"
        >
          <LuPlus className="ml-2 h-10 w-10" />
          <h1 className="text-lg">Join Team</h1>
        </motion.div>
      </motion.div>

      {isOpen && (
        <ShowTeamForJoin team={team} isOpen={isOpen} onClose={handleClose} />
      )}
    </>
  );
}
