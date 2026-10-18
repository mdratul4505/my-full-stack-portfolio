import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import {
  Cpu,
  FolderGit2,
  CheckCircle2,
  Mail,
  Plus,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardOverviewPage() {
  // Query live database counts concurrently
  const [
    totalSkills,
    totalProjects,
    publishedProjects,
    unreadMessages,
    recentMessages,
    featuredProjects,
  ] = await Promise.all([
    prisma.skill.count(),
    prisma.project.count(),
    prisma.project.count({ where: { isPublished: true } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.contactMessage.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({
      where: { isFeatured: true },
      take: 3,
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#303030]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3] mt-1 font-mono">
            Real-time status of your portfolio database and visitor communications.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/skills"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1A1A1A] border border-[#303030] text-xs font-semibold text-white hover:border-[#84CC16] hover:text-[#84CC16] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </Link>

          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#84CC16] text-[#111111] text-xs font-bold hover:bg-[#65A30D] transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Skills"
          value={totalSkills}
          description="In 4 distinct categories"
          icon={Cpu}
          badge="PostgreSQL"
        />

        <StatCard
          title="Total Projects"
          value={totalProjects}
          description="Configured in portfolio"
          icon={FolderGit2}
          badge="Live DB"
        />

        <StatCard
          title="Published Projects"
          value={publishedProjects}
          description="Visible to visitors"
          icon={CheckCircle2}
          badge="Active"
        />

        <StatCard
          title="Unread Messages"
          value={unreadMessages}
          description="Contact submissions"
          icon={Mail}
          badge={unreadMessages > 0 ? "Requires Review" : "Up to date"}
        />
      </div>

      {/* Grid: Recent Inquiries & Featured Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Contact Messages */}
        <div className="lg:col-span-7 bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#303030]">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#84CC16]" />
              <h2 className="text-base font-bold text-white">Recent Messages</h2>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs text-[#84CC16] hover:underline inline-flex items-center gap-1 font-mono"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="py-12 text-center text-[#737373] text-xs">
              No messages received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <Link
                  key={msg.id}
                  href="/admin/messages"
                  className={`block p-3.5 rounded-xl border transition-colors ${
                    !msg.isRead
                      ? "bg-[#111111] border-[#84CC16]/40 hover:border-[#84CC16]"
                      : "bg-[#141414] border-[#303030] hover:border-[#505050]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#84CC16] shrink-0" />
                      )}
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-[#737373] font-mono">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#84CC16] line-clamp-1">
                    {msg.subject}
                  </p>
                  <p className="text-xs text-[#A3A3A3] line-clamp-1 mt-0.5">
                    {msg.message}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Featured Projects Highlight */}
        <div className="lg:col-span-5 bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#303030]">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#84CC16]" />
              <h2 className="text-base font-bold text-white">Featured Projects</h2>
            </div>
            <Link
              href="/admin/projects"
              className="text-xs text-[#84CC16] hover:underline inline-flex items-center gap-1 font-mono"
            >
              <span>Manage</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {featuredProjects.length === 0 ? (
            <div className="py-12 text-center text-[#737373] text-xs">
              No featured projects marked yet.
            </div>
          ) : (
            <div className="space-y-3">
              {featuredProjects.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-[#111111] border border-[#303030] flex items-center justify-between gap-3"
                >
                  <div>
                    <h3 className="text-xs font-bold text-white">{p.title}</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.technologies.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono text-[#A3A3A3] bg-[#1A1A1A] px-1.5 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-[#A3A3A3] hover:text-[#84CC16] hover:bg-[#202020] transition-colors"
                      aria-label="Visit project"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
