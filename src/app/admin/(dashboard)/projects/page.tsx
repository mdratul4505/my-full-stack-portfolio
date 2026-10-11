import React from "react";
import prisma from "@/lib/prisma";
import { ProjectManagerClient } from "./ProjectManagerClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  return <ProjectManagerClient initialProjects={projects} />;
}
