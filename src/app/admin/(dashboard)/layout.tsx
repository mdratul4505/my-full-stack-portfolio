import React from "react";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth/session";
import { AdminLayoutClient } from "./AdminLayoutClient";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  // Real-time unread messages count
  const unreadCount = await prisma.contactMessage.count({
    where: { isRead: false },
  });

  return (
    <AdminLayoutClient
      adminName={session.name}
      adminEmail={session.email}
      unreadMessagesCount={unreadCount}
    >
      {children}
    </AdminLayoutClient>
  );
}
