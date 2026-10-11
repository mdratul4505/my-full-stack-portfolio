"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROLES = [
  "Full-Stack Web Developer",
  "Full-Stack Engineer",
  "Next.js & React Specialist",
  "MERN & PostgreSQL Developer",
];

export function RoleTypewriter() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROLES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center min-h-[40px] text-xl sm:text-2xl md:text-3xl font-semibold text-[#84CC16]">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="inline-block"
        >
          {ROLES[index]}
        </motion.span>
      </AnimatePresence>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        className="ml-1 inline-block w-[3px] h-6 md:h-8 bg-[#84CC16] rounded-full"
      />
    </div>
  );
}
