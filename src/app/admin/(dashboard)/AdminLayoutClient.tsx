"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  adminName: string;
  adminEmail: string;
  unreadMessagesCount: number;
}

export function AdminLayoutClient({
  children,
  adminName,
  adminEmail,
  unreadMessagesCount,
}: AdminLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col md:flex-row text-white selection:bg-[#84CC16]/20 selection:text-[#84CC16]">
      {/* Sidebar */}
      <AdminSidebar
        unreadMessagesCount={unreadMessagesCount}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar
          adminName={adminName}
          adminEmail={adminEmail}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
