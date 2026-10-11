"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] border border-red-800/60 flex items-center justify-center text-red-400 mb-6 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">
        Something went wrong
      </h1>
      <p className="text-xs text-[#A3A3A3] max-w-md mb-8">
        An unexpected error occurred while processing this page. Your data is safe.
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#84CC16] text-[#111111] font-bold text-xs hover:bg-[#65A30D] transition-colors shadow-sm"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
