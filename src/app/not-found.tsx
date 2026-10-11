import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] border border-[#303030] flex items-center justify-center text-[#84CC16] font-mono font-bold text-2xl mb-6 shadow-[0_0_20px_rgba(132,204,22,0.15)]">
        404
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-[#A3A3A3] max-w-md mb-8">
        The page you are looking for might have been moved, deleted, or does not exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#84CC16] text-[#111111] font-bold text-xs hover:bg-[#65A30D] transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Portfolio</span>
      </Link>
    </div>
  );
}
