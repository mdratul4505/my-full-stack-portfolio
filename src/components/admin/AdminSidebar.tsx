"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Cpu,
  FolderGit2,
  GraduationCap,
  User,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  X,
} from "lucide-react";
import { logoutAction } from "@/server/actions/auth";

interface AdminSidebarProps {
  unreadMessagesCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const NAV_LINKS = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Skills", href: "/admin/skills", icon: Cpu },
  { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "About & Bio", href: "/admin/about", icon: User },
  { name: "Messages", href: "/admin/messages", icon: Mail, badgeKey: "messages" },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({
  unreadMessagesCount = 0,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/admin/login");
    router.refresh();
  };

  const content = (
    <div className="flex flex-col h-full bg-[#1A1A1A] border-r border-[#303030] text-white">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#303030] flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[#84CC16] flex items-center justify-center text-[#84CC16] font-mono font-bold text-sm">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight block">Ratul Hasan</span>
            <span className="text-[10px] font-mono text-[#84CC16] uppercase tracking-wider block">Admin Control</span>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-[#A3A3A3] hover:text-white hover:bg-[#252525]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_LINKS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const showBadge = item.badgeKey === "messages" && unreadMessagesCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#84CC16] text-[#111111] font-bold shadow-[0_0_15px_rgba(132,204,22,0.25)]"
                  : "text-[#A3A3A3] hover:text-white hover:bg-[#222222]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-[#111111]" : "text-[#84CC16]"}`} />
                <span>{item.name}</span>
              </div>

              {showBadge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive
                      ? "bg-[#111111] text-[#84CC16]"
                      : "bg-[#84CC16] text-[#111111]"
                  }`}
                >
                  {unreadMessagesCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-[#303030] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-[#A3A3A3] hover:text-[#84CC16] hover:bg-[#222222] transition-colors"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4" />
            <span>View Live Site</span>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-[80%] h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
