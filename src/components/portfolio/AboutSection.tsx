"use client";

import React from "react";
import { SlideUp } from "./MotionWrappers";
import { GraduationCap, Code, Rocket, BookOpen, CheckCircle2 } from "lucide-react";

interface AboutSectionProps {
  aboutText: string;
  name: string;
  headline: string;
}

export function AboutSection({ aboutText, name, headline }: AboutSectionProps) {
  // Split paragraph by double newlines if present
  const paragraphs = aboutText ? aboutText.split("\n\n") : [];

  return (
    <section id="about" className="py-24 relative border-t border-[#303030]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SlideUp>
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#303030] text-xs font-mono text-[#84CC16] uppercase tracking-wider mb-3">
              <span>01. About Me</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Passionate About Code & Design
            </h2>
            <p className="text-xs text-[#84CC16] font-mono mt-2">{headline}</p>
            <div className="w-16 h-1 bg-[#84CC16] rounded-full mt-4" />
          </div>
        </SlideUp>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <SlideUp delay={0.1}>
              <div className="bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 sm:p-8 relative">
                <div className="space-y-4 text-[#A3A3A3] text-sm sm:text-base leading-relaxed">
                  {paragraphs.length > 0 ? (
                    paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
                  ) : (
                    <>
                      <p>
                        I am <strong className="text-white">{name}</strong>, a dedicated Full-Stack Web Developer currently
                        studying Computer Science & Technology at{" "}
                        <strong className="text-white">Satkhira Polytechnic Institute</strong>.
                      </p>
                      <p>
                        My journey revolves around building high-performance, modern, and accessible web
                        applications using React, Next.js, TypeScript, Tailwind CSS, Node.js, and PostgreSQL.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </SlideUp>

            {/* Core Values / Focus cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SlideUp delay={0.2}>
                <div className="bg-[#1A1A1A] border border-[#303030] rounded-xl p-5 hover:border-[#84CC16]/50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-[#111111] border border-[#303030] flex items-center justify-center text-[#84CC16] mb-3">
                    <Code className="w-4 h-4" />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">Clean Architecture</h4>
                  <p className="text-xs text-[#A3A3A3] leading-normal">
                    Prioritizing clean modular code, reusability, and type safety across all components.
                  </p>
                </div>
              </SlideUp>

              <SlideUp delay={0.25}>
                <div className="bg-[#1A1A1A] border border-[#303030] rounded-xl p-5 hover:border-[#84CC16]/50 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-[#111111] border border-[#303030] flex items-center justify-center text-[#84CC16] mb-3">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">Performance First</h4>
                  <p className="text-xs text-[#A3A3A3] leading-normal">
                    Delivering fast load times, optimized server components, and responsive experiences.
                  </p>
                </div>
              </SlideUp>
            </div>
          </div>

          {/* Right Highlights Column */}
          <div className="lg:col-span-5 space-y-5">
            <SlideUp delay={0.15}>
              <div className="bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 sm:p-7">
                <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#84CC16]" />
                  <span>Academic Background</span>
                </h3>

                <div className="border-l-2 border-[#84CC16]/40 pl-4 space-y-4">
                  <div>
                    <span className="text-xs font-mono text-[#84CC16] uppercase">Institution</span>
                    <p className="text-white font-semibold text-sm">
                      Satkhira Polytechnic Institute
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-[#84CC16] uppercase">Department</span>
                    <p className="text-white font-medium text-sm">
                      Computer Science & Technology (CST)
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-[#84CC16] uppercase">Core Studies</span>
                    <p className="text-xs text-[#A3A3A3]">
                      Data Structures, Web Engineering, Database Systems, Computer Networks
                    </p>
                  </div>
                </div>
              </div>
            </SlideUp>

            <SlideUp delay={0.3}>
              <div className="bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 sm:p-7">
                <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#84CC16]" />
                  <span>Key Interests</span>
                </h3>

                <ul className="space-y-2.5 text-xs sm:text-sm text-[#A3A3A3]">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#84CC16] shrink-0" />
                    <span>Modern React & Next.js Server Components</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#84CC16] shrink-0" />
                    <span>Interactive UI/UX with Tailwind & Framer Motion</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#84CC16] shrink-0" />
                    <span>PostgreSQL & Prisma ORM Database Design</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#84CC16] shrink-0" />
                    <span>RESTful APIs & Secure Server-Side Authentication</span>
                  </li>
                </ul>
              </div>
            </SlideUp>
          </div>
        </div>
      </div>
    </section>
  );
}
