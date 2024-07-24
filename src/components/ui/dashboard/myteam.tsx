"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { MdDashboardCustomize } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";

export const MyTeam = () => {
  return (
    <motion.div
      className="group"
      whileHover={{
        scale: 1.1,
      }}
    >
      <Link
        href="/dashboard/team"
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
            Team
            <RiTeamFill size={100} />
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
};
