"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export function GlowEffect() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#84CC16]/5 blur-[120px] rounded-full" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Top Hero ambient glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[#84CC16] blur-[150px] rounded-full"
      />

      {/* Subtle mid section accent glow */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-[45%] right-[5%] w-[500px] h-[400px] bg-[#84CC16] blur-[160px] rounded-full"
      />

      {/* Subtle footer glow */}
      <div className="absolute bottom-[-5%] left-[10%] w-[500px] h-[350px] bg-[#84CC16]/5 blur-[140px] rounded-full" />
    </div>
  );
}
