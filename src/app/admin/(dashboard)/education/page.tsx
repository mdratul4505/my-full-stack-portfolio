import React from "react";
import prisma from "@/lib/prisma";
import { EducationManagerClient } from "./EducationManagerClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminEducationPage() {
  const education = await prisma.education.findMany({
    orderBy: { order: "asc" },
  });

  return <EducationManagerClient initialEducation={education} />;
}
