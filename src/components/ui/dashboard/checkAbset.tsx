"use client";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { motion } from "framer-motion";
import { Button } from "../button";
import TogleStartTask from "../profile/togleShowStartTask";
import ConfgigStartSalary from "./togleStartConfigSalary";
import AbsentCheck from "./absentCheck";
import { FaPersonBooth } from "react-icons/fa6";

export default function CheckAbset() {
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
          <FaPersonBooth size={100} />
          <h1 className="text-lg">Check absent</h1>
        </motion.div>
      </motion.div>

      {isOpen && <AbsentCheck isOpen={isOpen} onClose={handleClose} />}
    </>
  );
}
