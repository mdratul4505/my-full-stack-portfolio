"use client";

import React, { useState } from "react";
import { SlideUp, StaggerContainer, StaggerItem } from "./MotionWrappers";
import { SkillIcon } from "./SkillIcon";
import { Sparkles, Layers, Server, Database as DbIcon, Wrench } from "lucide-react";

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  proficiency?: string | null;
  order: number;
}

interface SkillsSectionProps {
  skills: SkillItem[];
}

const CATEGORY_TABS = [
  { key: "ALL", label: "All Skills", icon: Sparkles },
  { key: "Frontend Development", label: "Frontend", icon: Layers },
  { key: "Backend Development", label: "Backend", icon: Server },
  { key: "Database", label: "Database", icon: DbIcon },
  { key: "Tools & Version Control", label: "Tools", icon: Wrench },
];

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredSkills =
    selectedCategory === "ALL"
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className="py-24 relative border-t border-[#303030]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SlideUp>
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#303030] text-xs font-mono text-[#84CC16] uppercase tracking-wider mb-3">
              <span>02. Technical Arsenal</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Skills & Technologies
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A3A3A3] max-w-xl">
              Technologies and developer tools I leverage to build robust web products.
            </p>
            <div className="w-16 h-1 bg-[#84CC16] rounded-full mt-4" />
          </div>
        </SlideUp>

        {/* Category Filter Tabs */}
        <SlideUp delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {CATEGORY_TABS.map((tab) => {
              const isSelected = selectedCategory === tab.key;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? "bg-[#84CC16] text-[#111111] font-semibold shadow-[0_0_15px_rgba(132,204,22,0.3)] scale-105"
                      : "bg-[#1A1A1A] text-[#A3A3A3] border border-[#303030] hover:border-[#84CC16]/60 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </SlideUp>

        {/* Skills Cards Grid */}
        {filteredSkills.length === 0 ? (
          <div className="text-center py-12 text-[#A3A3A3] bg-[#1A1A1A] border border-[#303030] rounded-2xl">
            No skills found in this category.
          </div>
        ) : (
          <StaggerContainer
            key={selectedCategory}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {filteredSkills.map((skill) => (
              <StaggerItem key={skill.id}>
                <div className="group relative bg-[#1A1A1A] border border-[#303030] rounded-xl p-4 sm:p-5 flex flex-col items-center text-center justify-between min-h-[130px] hover:border-[#84CC16] hover:bg-[#202020] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(132,204,22,0.15)]">
                  {/* Subtle top lime indicator */}
                  <div className="w-8 h-1 bg-transparent group-hover:bg-[#84CC16] rounded-full transition-colors mb-2" />

                  {/* Icon */}
                  <div className="p-2.5 rounded-lg bg-[#111111] border border-[#303030] group-hover:border-[#84CC16]/40 transition-colors mb-3">
                    <SkillIcon iconName={skill.icon} className="w-6 h-6 text-[#84CC16]" />
                  </div>

                  {/* Skill Name */}
                  <span className="text-sm font-semibold text-white group-hover:text-[#84CC16] transition-colors line-clamp-1">
                    {skill.name}
                  </span>

                  {/* Proficiency Tag if available */}
                  {skill.proficiency ? (
                    <span className="mt-2 text-[10px] font-mono uppercase tracking-wider text-[#A3A3A3] bg-[#111111] px-2 py-0.5 rounded border border-[#303030] group-hover:border-[#84CC16]/30">
                      {skill.proficiency}
                    </span>
                  ) : (
                    <span className="mt-2 text-[10px] font-mono text-[#737373]">
                      {skill.category.split(" ")[0]}
                    </span>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
