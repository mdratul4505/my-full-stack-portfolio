"use client";

import React from "react";
import {
  Code2,
  Palette,
  FileCode,
  FileCode2,
  Atom,
  Layers,
  Wind,
  Sparkles,
  Server,
  Cpu,
  Globe,
  Database,
  HardDrive,
  Boxes,
  Laptop,
  GitBranch,
  Send,
  CloudUpload,
  Cloud,
  Terminal,
  FolderGit2,
  CpuIcon,
  Shield,
  Zap,
  Box,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";

interface SkillIconProps {
  iconName?: string | null;
  className?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Palette,
  FileCode,
  FileCode2,
  Atom,
  Layers,
  Wind,
  Sparkles,
  Server,
  Cpu,
  Globe,
  Database,
  HardDrive,
  Boxes,
  Laptop,
  GitBranch,
  Github: GithubIcon,
  Send,
  CloudUpload,
  Cloud,
  Terminal,
  FolderGit2,
  CpuIcon,
  Shield,
  Zap,
  Box,
};

export function SkillIcon({ iconName, className = "w-6 h-6 text-[#84CC16]" }: SkillIconProps) {
  if (!iconName) {
    return <Code2 className={className} />;
  }

  const IconComponent = ICON_MAP[iconName] || Code2;
  return <IconComponent className={className} />;
}
