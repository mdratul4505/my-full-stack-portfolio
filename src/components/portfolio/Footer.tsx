"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, Mail, Shield } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

interface FooterProps {
  name: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  email?: string | null;
}

export function Footer({ name, githubUrl, linkedinUrl, email }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[#303030] bg-[#111111] py-12 text-[#A3A3A3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Developer Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center space-x-2 text-white font-bold text-lg tracking-tight mb-1">
              <span className="w-7 h-7 rounded-lg bg-[#1A1A1A] border border-[#303030] flex items-center justify-center text-[#84CC16] text-xs font-mono font-bold">
                RH
              </span>
              <span>{name || "Md. Ratul Hasan"}</span>
            </div>
            <p className="text-xs text-[#A3A3A3]">
              Frontend Developer & Aspiring Full-Stack Engineer
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center flex-wrap justify-center gap-4 text-xs font-medium">
            <a href="#home" className="hover:text-[#84CC16] transition-colors">Home</a>
            <a href="#about" className="hover:text-[#84CC16] transition-colors">About</a>
            <a href="#skills" className="hover:text-[#84CC16] transition-colors">Skills</a>
            <a href="#education" className="hover:text-[#84CC16] transition-colors">Education</a>
            <a href="#projects" className="hover:text-[#84CC16] transition-colors">Projects</a>
            <a href="#contact" className="hover:text-[#84CC16] transition-colors">Contact</a>
          </div>

          {/* Socials & Scroll to Top */}
          <div className="flex items-center gap-3">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#303030] flex items-center justify-center text-[#A3A3A3] hover:text-[#84CC16] hover:border-[#84CC16] transition-all hover:scale-105"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}

            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#303030] flex items-center justify-center text-[#A3A3A3] hover:text-[#84CC16] hover:border-[#84CC16] transition-all hover:scale-105"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}

            {email && (
              <a
                href={`mailto:${email}`}
                aria-label="Email"
                className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#303030] flex items-center justify-center text-[#A3A3A3] hover:text-[#84CC16] hover:border-[#84CC16] transition-all hover:scale-105"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="w-9 h-9 rounded-lg bg-[#1A1A1A] border border-[#303030] flex items-center justify-center text-[#A3A3A3] hover:text-[#84CC16] hover:border-[#84CC16] transition-all hover:scale-105 ml-2"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-[#303030]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#737373] gap-4">
          <p>© {currentYear} Md. Ratul Hasan. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px]">Crafted with Next.js, Prisma & PostgreSQL</span>
            <Link
              href="/admin/login"
              className="text-[#525252] hover:text-[#84CC16] transition-colors inline-flex items-center gap-1 font-mono text-[10px]"
              aria-label="Admin Portal"
            >
              <Shield className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
