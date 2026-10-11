import React from "react";
import prisma from "@/lib/prisma";
import { MessagesManagerClient } from "./MessagesManagerClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <MessagesManagerClient initialMessages={messages} />;
}
