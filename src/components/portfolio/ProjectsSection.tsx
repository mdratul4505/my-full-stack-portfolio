"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SlideUp, StaggerContainer, StaggerItem } from "./MotionWrappers";
import { ExternalLink, Star, FolderKanban, Eye, X } from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { motion, AnimatePresence } from "framer-motion";

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
  technologies: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  isFeatured: boolean;
  order: number;
}

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Close modal on Escape key and prevent background scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedProject]);

  const displayedProjects =
    filter === "featured"
      ? projects.filter((p) => p.isFeatured)
      : projects;

  return (
    <section id="projects" className="py-24 relative border-t border-[#303030]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SlideUp>
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#303030] text-xs font-mono text-[#84CC16] uppercase tracking-wider mb-3">
              <span>04. Selected Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Projects
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A3A3A3] max-w-xl">
              Real-world web applications crafted with precision, responsiveness, and clean code.
            </p>
            <div className="w-16 h-1 bg-[#84CC16] rounded-full mt-4" />
          </div>
        </SlideUp>

        {/* Filter Toggle */}
        <SlideUp delay={0.1}>
          <div className="flex justify-center gap-2 mb-12">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filter === "all"
                  ? "bg-[#84CC16] text-[#111111] shadow-[0_0_15px_rgba(132,204,22,0.3)]"
                  : "bg-[#1A1A1A] text-[#A3A3A3] border border-[#303030] hover:text-white"
              }`}
            >
              All Projects ({projects.length})
            </button>
            <button
              onClick={() => setFilter("featured")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filter === "featured"
                  ? "bg-[#84CC16] text-[#111111] shadow-[0_0_15px_rgba(132,204,22,0.3)]"
                  : "bg-[#1A1A1A] text-[#A3A3A3] border border-[#303030] hover:text-white"
              }`}
            >
              Featured Only ({projects.filter((p) => p.isFeatured).length})
            </button>
          </div>
        </SlideUp>

        {/* Projects Grid */}
        {displayedProjects.length === 0 ? (
          <div className="text-center py-16 bg-[#1A1A1A] border border-[#303030] rounded-2xl text-[#A3A3A3]">
            No projects found in this category.
          </div>
        ) : (
          <StaggerContainer
            key={filter}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {displayedProjects.map((project) => (
              <StaggerItem key={project.id}>
                <div className="group flex flex-col h-full bg-[#1A1A1A] border border-[#303030] rounded-2xl overflow-hidden hover:border-[#84CC16] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(132,204,22,0.15)]">
                  {/* Thumbnail / Header Area */}
                  <div className="relative w-full h-52 sm:h-56 bg-[#151515] overflow-hidden border-b border-[#303030]">
                    {project.imageUrl ? (
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized={project.imageUrl.startsWith("data:")}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#181818] to-[#121212]">
                        <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-[#303030] group-hover:border-[#84CC16]/50 flex items-center justify-center text-[#84CC16] transition-colors duration-300 shadow-inner mb-3">
                          <FolderKanban className="w-7 h-7" />
                        </div>
                        <span className="text-lg font-bold text-white tracking-wide">
                          {project.title}
                        </span>
                        <span className="text-xs text-[#A3A3A3] mt-1 font-mono">
                          Web Application
                        </span>
                      </div>
                    )}

                    {/* Featured Ribbon Badge */}
                    {project.isFeatured && (
                      <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#111111]/90 backdrop-blur-md border border-[#84CC16]/40 text-[#84CC16] text-[11px] font-semibold">
                        <Star className="w-3 h-3 fill-[#84CC16]" />
                        <span>Featured</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Title */}
                      <h3 className="text-xl font-bold text-white group-hover:text-[#84CC16] transition-colors mb-2">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed mb-6 line-clamp-3">
                        {project.description}
                      </p>

                      {/* Technologies Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-md bg-[#111111] border border-[#303030] text-[11px] font-mono text-[#A3A3A3] group-hover:border-[#84CC16]/30 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Links & View Details Button */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-[#303030]/60">
                      {/* View Details Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#222222] border border-[#353535] text-white text-xs font-semibold hover:border-[#84CC16] hover:text-[#84CC16] transition-all duration-200 active:scale-95 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#84CC16]" />
                        <span>View Details</span>
                      </button>

                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#84CC16] text-[#111111] text-xs font-bold hover:bg-[#65A30D] transition-all duration-200 active:scale-95 shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#111111] border border-[#303030] text-white text-xs font-semibold hover:border-[#84CC16] hover:text-[#84CC16] transition-all duration-200 active:scale-95"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>Source</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#161616] border border-[#303030] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
            >
              {/* Modal Top Banner / Image */}
              <div className="relative w-full h-56 sm:h-72 bg-[#121212] border-b border-[#303030] shrink-0 overflow-hidden">
                {selectedProject.imageUrl ? (
                  <Image
                    src={selectedProject.imageUrl}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="object-cover"
                    unoptimized={selectedProject.imageUrl.startsWith("data:")}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#181818] to-[#121212]">
                    <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] border border-[#303030] flex items-center justify-center text-[#84CC16] mb-3">
                      <FolderKanban className="w-8 h-8" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-wide">
                      {selectedProject.title}
                    </span>
                    <span className="text-xs text-[#A3A3A3] mt-1 font-mono">
                      Full-Stack / Frontend Web Application
                    </span>
                  </div>
                )}

                {/* Floating Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-3.5 right-3.5 p-2 rounded-xl bg-[#111111]/80 backdrop-blur-md border border-[#303030] text-[#A3A3A3] hover:text-white hover:border-[#84CC16] transition-colors z-10"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Featured Badge */}
                {selectedProject.isFeatured && (
                  <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#111111]/90 backdrop-blur-md border border-[#84CC16]/50 text-[#84CC16] text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-[#84CC16]" />
                    <span>Featured Project</span>
                  </div>
                )}
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1">
                {/* Title */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {selectedProject.title}
                  </h3>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-xs font-mono font-semibold text-[#84CC16] uppercase tracking-wider mb-2.5">
                    Technologies &amp; Tools
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-[#111111] border border-[#303030] text-xs font-mono text-[#D4D4D4]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Full Description */}
                <div>
                  <h4 className="text-xs font-mono font-semibold text-[#84CC16] uppercase tracking-wider mb-2.5">
                    About The Project
                  </h4>
                  <div className="p-4 rounded-xl bg-[#111111] border border-[#262626]">
                    <p className="text-sm sm:text-base text-[#D4D4D4] leading-relaxed whitespace-pre-wrap font-sans">
                      {selectedProject.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer with Actions */}
              <div className="p-4 sm:p-5 bg-[#121212] border-t border-[#303030] flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#84CC16] text-[#111111] text-xs font-bold hover:bg-[#65A30D] transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Preview</span>
                    </a>
                  )}

                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#303030] text-white text-xs font-semibold hover:border-[#84CC16] hover:text-[#84CC16] transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>View Code</span>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-xl bg-[#202020] border border-[#303030] text-xs font-semibold text-[#A3A3A3] hover:text-white transition-colors ml-auto"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
