"use client";

import React from "react";
import { SlideUp } from "./MotionWrappers";
import { GraduationCap, Calendar, Award, BookCheck } from "lucide-react";

export interface EducationItem {
  id: string;
  institution: string;
  department: string;
  degree?: string | null;
  semester?: string | null;
  startYear?: string | null;
  endYear?: string | null;
  cgpa?: string | null;
  description?: string | null;
}

interface EducationSectionProps {
  educationList: EducationItem[];
}

export function EducationSection({ educationList }: EducationSectionProps) {
  return (
    <section id="education" className="py-24 relative border-t border-[#303030]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SlideUp>
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#303030] text-xs font-mono text-[#84CC16] uppercase tracking-wider mb-3">
              <span>03. Academic Milestones</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Education & Qualifications
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A3A3A3] max-w-xl">
              Formal studies and computer science foundations that shape my engineering principles.
            </p>
            <div className="w-16 h-1 bg-[#84CC16] rounded-full mt-4" />
          </div>
        </SlideUp>

        {/* Education Timeline */}
        <div className="max-w-3xl mx-auto space-y-6">
          {educationList.map((item, idx) => (
            <SlideUp key={item.id} delay={0.1 * idx}>
              <div className="group relative bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 sm:p-8 hover:border-[#84CC16] transition-all duration-300 hover:shadow-[0_0_25px_rgba(132,204,22,0.12)]">
                {/* Left accent vertical indicator */}
                <div className="absolute left-0 top-8 bottom-8 w-1 bg-[#84CC16] rounded-r-full group-hover:w-1.5 transition-all" />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="w-5 h-5 text-[#84CC16]" />
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#84CC16] transition-colors">
                        {item.institution}
                      </h3>
                    </div>
                    <p className="text-sm font-medium text-[#84CC16]/90">
                      {item.department}
                    </p>
                    {item.degree && (
                      <p className="text-xs text-[#A3A3A3] mt-0.5">
                        {item.degree}
                      </p>
                    )}
                  </div>

                  {/* Year / Semester Badges */}
                  <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 shrink-0">
                    {(item.startYear || item.endYear) && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] border border-[#303030] text-xs font-mono text-[#A3A3A3]">
                        <Calendar className="w-3.5 h-3.5 text-[#84CC16]" />
                        <span>
                          {item.startYear ? `${item.startYear} - ` : ""}
                          {item.endYear || "Present"}
                        </span>
                      </span>
                    )}

                    {item.semester && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#84CC16]/10 border border-[#84CC16]/30 text-xs font-mono text-[#84CC16]">
                        <BookCheck className="w-3 h-3" />
                        <span>{item.semester}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* CGPA if provided */}
                {item.cgpa && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#111111] border border-[#303030] text-xs font-medium text-white mb-4">
                    <Award className="w-4 h-4 text-[#84CC16]" />
                    <span>CGPA: <strong className="text-[#84CC16]">{item.cgpa}</strong></span>
                  </div>
                )}

                {/* Description */}
                {item.description && (
                  <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed border-t border-[#303030]/60 pt-4 mt-2">
                    {item.description}
                  </p>
                )}
              </div>
            </SlideUp>
          ))}
        </div>
      </div>
    </section>
  );
}
