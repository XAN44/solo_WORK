"use client";

import { motion } from "framer-motion";

const Loading = () => {
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
          fontSize: "3rem",
          marginBottom: "1rem",
          fontFamily: "Arial, sans-serif",
          letterSpacing: "0.1em",
        }}
      >
        Loading...
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <motion.svg width="100" height="100" viewBox="0 0 100 100">
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke="#1DB954"
            strokeWidth="4"
            fill="none"
            initial={{ strokeDasharray: 251, strokeDashoffset: 251 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="30"
            stroke="#ffffff"
            strokeWidth="4"
            fill="none"
            initial={{ strokeDasharray: 188, strokeDashoffset: 188 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
};

export default Loading;
