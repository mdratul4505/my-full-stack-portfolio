"use client";

import React from "react";
import Link from "next/link";
import { Menu, ExternalLink, ShieldCheck } from "lucide-react";

interface AdminNavbarProps {
  adminName?: string;
  adminEmail?: string;
  onOpenMobileMenu: () => void;
}

export function AdminNavbar({
  adminName = "Administrator",
  adminEmail,
  onOpenMobileMenu,
}: AdminNavbarProps) {
  return (
    <header className="h-16 bg-[#1A1A1A] border-b border-[#303030] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg bg-[#111111] border border-[#303030] text-[#A3A3A3] hover:text-white"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
          <span className="text-xs font-mono text-[#84CC16] uppercase tracking-wider hidden sm:inline">
            Secure Portal Active
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] border border-[#303030] text-xs font-medium text-[#A3A3A3] hover:text-[#84CC16] hover:border-[#84CC16] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Site</span>
        </Link>

        {/* User Badge */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l border-[#303030]">
          <div className="w-8 h-8 rounded-full bg-[#111111] border border-[#84CC16]/60 flex items-center justify-center text-[#84CC16]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-white leading-tight">
              {adminName}
            </span>
            <span className="text-[10px] text-[#A3A3A3] font-mono leading-tight">
              {adminEmail || "Super Admin"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
