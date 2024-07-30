"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        color: "#ffffff",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: "4rem",
          marginBottom: "1rem",
          fontFamily: "Arial, sans-serif",
          letterSpacing: "0.1em",
        }}
      >
        404 - Page Not Found
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: "1.5rem",
          marginBottom: "2rem",
          fontFamily: "Arial, sans-serif",
          letterSpacing: "0.1em",
        }}
      >
        The page you are looking for does not exist.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.svg width="300" height="300" viewBox="0 0 300 300">
          <motion.circle
            cx="150"
            cy="150"
            r="100"
            stroke="#1DB954"
            strokeWidth="5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.line
            x1="50"
            y1="150"
            x2="250"
            y2="150"
            stroke="#1DB954"
            strokeWidth="5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.line
            x1="150"
            y1="50"
            x2="150"
            y2="250"
            stroke="#1DB954"
            strokeWidth="5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.rect
            width="140"
            height="140"
            x="80"
            y="80"
            rx="20"
            stroke="#1DB954"
            strokeWidth="5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
};

export default NotFound;
