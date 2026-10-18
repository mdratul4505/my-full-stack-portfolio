import React from "react";
import prisma from "@/lib/prisma";
import { SkillManagerClient } from "./SkillManagerClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { createdAt: "desc" }],
  });

  return <SkillManagerClient initialSkills={skills} />;
}
