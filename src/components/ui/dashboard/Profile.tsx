"use client";
import React from "react";
import { MdDashboardCustomize } from "react-icons/md";
import { motion } from "framer-motion";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";

interface Model {
  id: string;
}

export default function YourProfile({ id }: Model) {
  return (
    <motion.div
      whileHover={{
        scale: 1.1,
      }}
    >
      <Link
        href={`/dashboard/profile/${id}`}
        className="flex flex-col items-center justify-center"
      >
        <motion.div className="h-60 w-60 rounded-lg bg-black text-white">
          <motion.div
            whileHover={{
              scale: 1.1,
              transition: {
                duration: 0.5,
              },
            }}
            className="flex h-full w-full flex-col items-center justify-center"
          >
            Your Profile
            <CgProfile size={100} />
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
