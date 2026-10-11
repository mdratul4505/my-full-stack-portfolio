"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileDown, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  resumeUrl?: string | null;
  profileImage?: string | null;
}

const NAV_ITEMS = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Education", href: "#education" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export function Navbar({ resumeUrl, profileImage }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = NAV_ITEMS.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#111111]/90 backdrop-blur-md border-b border-[#303030] py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          href="#home"
          className="group flex items-center space-x-2.5 text-white font-bold text-lg sm:text-xl tracking-tight transition-colors"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#303030] group-hover:border-[#84CC16] bg-[#1A1A1A] shrink-0 transition-colors duration-200">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Md. Ratul Hasan"
                fill
                className="object-cover object-top"
                sizes="32px"
                unoptimized
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-[#84CC16] text-xs font-mono font-bold">
                RH
              </span>
            )}
          </div>
          <span className="group-hover:text-[#84CC16] transition-colors duration-200">
            Md. Ratul Hasan
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-[#1A1A1A]/80 border border-[#303030] rounded-full px-4 py-1.5 backdrop-blur-sm">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <a
                key={item.name}
                href={item.href}
                className={`relative px-3 py-1.5 text-xs lg:text-sm font-medium transition-colors duration-200 rounded-full ${
                  isActive
                    ? "text-[#84CC16] font-semibold"
                    : "text-[#A3A3A3] hover:text-white"
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 bg-[#84CC16]/10 border border-[#84CC16]/30 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Action: Download Resume */}
        <div className="hidden md:flex items-center space-x-3">
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs lg:text-sm font-semibold rounded-lg bg-[#84CC16] text-[#111111] hover:bg-[#65A30D] transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(132,204,22,0.35)] active:scale-95"
            >
              <FileDown className="w-4 h-4" />
              <span>Resume</span>
            </a>
          ) : (
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs lg:text-sm font-semibold rounded-lg bg-[#1A1A1A] border border-[#303030] text-white hover:border-[#84CC16] hover:text-[#84CC16] transition-all duration-200 active:scale-95"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[#84CC16] text-[#111111] hover:bg-[#65A30D] transition-colors text-xs font-bold"
              aria-label="Download Resume"
            >
              <FileDown className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#1A1A1A] border border-[#303030] text-[#A3A3A3] hover:text-white hover:border-[#84CC16] transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#84CC16]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-[#1A1A1A] border-b border-[#303030] px-4 py-5 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col space-y-2">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#84CC16]/10 text-[#84CC16] border border-[#84CC16]/30 font-semibold"
                        : "text-[#A3A3A3] hover:text-white hover:bg-[#242424]"
                    }`}
                  >
                    {item.name}
                  </a>
                );
              })}
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#84CC16] text-[#111111] font-semibold text-sm hover:bg-[#65A30D] transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  Download Resume
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
