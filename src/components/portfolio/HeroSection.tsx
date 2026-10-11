"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { RoleTypewriter } from "./RoleTypewriter";
import { Mail, ArrowDown, FolderGit2, Sparkles, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

interface HeroSectionProps {
  name: string;
  headline: string;
  shortBio: string;
  profileImage?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  email?: string | null;
}

export function HeroSection({
  name,
  headline,
  shortBio,
  profileImage,
  githubUrl,
  linkedinUrl,
  email,
}: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Introduction & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Availability Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1A1A] border border-[#303030] text-xs font-medium text-[#A3A3A3] mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
              <span>Available for New Opportunities</span>
            </motion.div>

            {/* Greeting & Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight"
            >
              Hi, I&apos;m{" "}
              <span className="text-white hover:text-[#84CC16] transition-colors duration-300">
                {name || "Md. Ratul Hasan"}
              </span>
            </motion.h1>

            {/* Animated Role Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-3 mb-4"
            >
              <RoleTypewriter />
            </motion.div>

            {/* Headline / Subtitle */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg sm:text-xl font-medium text-[#A3A3A3] max-w-xl"
            >
              {headline || "Frontend Developer & Aspiring Full-Stack Engineer"}
            </motion.h2>

            {/* Short Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-4 text-sm sm:text-base text-[#A3A3A3] leading-relaxed max-w-xl"
            >
              {shortBio ||
                "Passionate about building modern, responsive, user-friendly web applications with clean code and intuitive design."}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8 flex flex-wrap gap-4 items-center"
            >
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#84CC16] text-[#111111] font-semibold text-sm hover:bg-[#65A30D] transition-all duration-200 shadow-sm hover:shadow-[0_0_20px_rgba(132,204,22,0.35)] active:scale-95"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>View My Projects</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1A1A1A] border border-[#303030] text-white font-medium text-sm hover:border-[#84CC16] hover:text-[#84CC16] transition-all duration-200 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Contact Me</span>
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-8 flex items-center space-x-3"
            >
              <span className="text-xs uppercase tracking-wider text-[#A3A3A3] font-mono mr-2">
                Connect:
              </span>

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#303030] flex items-center justify-center text-[#A3A3A3] hover:text-[#84CC16] hover:border-[#84CC16] transition-all duration-200 hover:scale-105"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}

              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#303030] flex items-center justify-center text-[#A3A3A3] hover:text-[#84CC16] hover:border-[#84CC16] transition-all duration-200 hover:scale-105"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  aria-label="Send Email"
                  className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#303030] flex items-center justify-center text-[#A3A3A3] hover:text-[#84CC16] hover:border-[#84CC16] transition-all duration-200 hover:scale-105"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          </motion.div>

          {/* Right Column: Profile Image Placeholder with Lime Border Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative group">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#84CC16]/20 to-[#84CC16]/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-70 group-hover:opacity-100" />

              {/* Photo Card Container */}
              <div className="relative w-72 h-84 sm:w-80 sm:h-96 rounded-2xl bg-[#1A1A1A] border border-[#303030] p-3 shadow-2xl flex flex-col items-center justify-center overflow-hidden group-hover:border-[#84CC16]/50 transition-colors duration-300">
                {profileImage ? (
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src={profileImage}
                      alt={name}
                      fill
                      sizes="(max-width: 768px) 100vw, 450px"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      priority
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-xl bg-[#111111] border border-[#303030] flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-[#1A1A1A] border border-[#84CC16]/40 flex items-center justify-center text-[#84CC16] font-mono text-3xl font-bold shadow-[0_0_20px_rgba(132,204,22,0.15)] mb-4">
                      RH
                    </div>
                    <span className="text-white font-semibold text-base mb-1">
                      {name}
                    </span>
                    <span className="text-xs text-[#84CC16] font-mono uppercase tracking-wider mb-3">
                      Full-Stack Dev
                    </span>
                    <p className="text-xs text-[#A3A3A3] max-w-[200px]">
                      Specializing in React, Next.js, TypeScript & PostgreSQL
                    </p>
                  </div>
                )}

                {/* Floating Status Badge */}
                <div className="absolute bottom-5 left-5 right-5 bg-[#111111]/90 backdrop-blur-md border border-[#303030] rounded-lg py-2 px-3 flex items-center justify-between text-xs">
                  <span className="text-[#A3A3A3] font-mono">Status:</span>
                  <span className="text-[#84CC16] font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Open to Work
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll down indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-16 sm:mt-20 flex justify-center"
        >
          <a
            href="#about"
            className="group flex flex-col items-center gap-2 text-xs font-mono text-[#A3A3A3] hover:text-[#84CC16] transition-colors"
          >
            <span>SCROLL DOWN</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="w-4 h-4 text-[#84CC16]" />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
