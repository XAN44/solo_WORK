"use client";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { motion } from "framer-motion";
import { Button } from "../button";
import TogleLeaveRequest from "./togleShowLeaveRequest";

export default function LeaveRequest() {
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
          <h1 className="text-lg">Leave request</h1>
        </motion.div>
      </motion.div>

      {isOpen && <TogleLeaveRequest isOpen={isOpen} onClose={handleClose} />}
    </>
  );
}
