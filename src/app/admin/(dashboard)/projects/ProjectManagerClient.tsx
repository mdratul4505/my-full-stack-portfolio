"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  toggleProjectPublishAction,
  toggleProjectFeaturedAction,
} from "@/server/actions/projects";
import { uploadImageAction } from "@/server/actions/upload";
import { compressImageFile } from "@/lib/client-image";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Star,
  Eye,
  EyeOff,
  Upload,
  X,
  Loader2,
  FolderKanban,
  Image as ImageIcon,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";

interface ProjectData {
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
  isPublished: boolean;
}

interface ProjectManagerClientProps {
  initialProjects: ProjectData[];
}

const sortProjectsByOrder = (items: ProjectData[]) => {
  return [...items].sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return 0;
  });
};

export function ProjectManagerClient({ initialProjects }: ProjectManagerClientProps) {
  const [projects, setProjects] = useState<ProjectData[]>(() => sortProjectsByOrder(initialProjects));

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Auto-hide status message after 3.5s
  React.useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formTechnologies, setFormTechnologies] = useState("");
  const [formLiveUrl, setFormLiveUrl] = useState("");
  const [formGithubUrl, setFormGithubUrl] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formOrder, setFormOrder] = useState(1);
  const [formPublished, setFormPublished] = useState(true);

  const openAddModal = () => {
    setEditingProject(null);
    setFormTitle("");
    setFormSlug("");
    setFormDescription("");
    setFormImageUrl("");
    setFormTechnologies("React, Next.js, Tailwind CSS");
    setFormLiveUrl("");
    setFormGithubUrl("");
    setFormFeatured(false);
    const maxOrder = projects.length > 0 ? Math.max(...projects.map((p) => p.order || 0)) : 0;
    setFormOrder(maxOrder + 1);
    setFormPublished(true);
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: ProjectData) => {
    setEditingProject(project);
    setFormTitle(project.title);
    setFormSlug(project.slug);
    setFormDescription(project.description);
    setFormImageUrl(project.imageUrl || "");
    setFormTechnologies(project.technologies.join(", "));
    setFormLiveUrl(project.liveUrl || "");
    setFormGithubUrl(project.githubUrl || "");
    setFormFeatured(project.isFeatured);
    setFormOrder(project.order);
    setFormPublished(project.isPublished);
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  // Auto-slug generator on title typing
  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingProject) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormSlug(generatedSlug);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setStatusMessage(null);

    try {
      // 1. Instant client-side compression to lightweight WebP data URL
      const compressedDataUrl = await compressImageFile(file, 1400, 0.85);
      setFormImageUrl(compressedDataUrl);
      setStatusMessage({ type: "success", text: "Image selected and optimized successfully!" });
    } catch (clientErr) {
      console.warn("Client image compression error, trying server action:", clientErr);
      // Fallback: server upload
      try {
        const formData = new FormData();
        formData.append("file", file);
        const actionRes = await uploadImageAction(formData);
        if (actionRes.success && actionRes.url) {
          setFormImageUrl(actionRes.url);
          setStatusMessage({ type: "success", text: "Image uploaded successfully!" });
        } else {
          alert(actionRes.error || "Failed to upload file. Please choose a valid image.");
        }
      } catch {
        alert("Error occurred uploading image.");
      }
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    const techArray = formTechnologies
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingProject) {
        const res = await updateProjectAction(editingProject.id, {
          title: formTitle,
          slug: formSlug,
          description: formDescription,
          imageUrl: formImageUrl || null,
          technologies: techArray,
          liveUrl: formLiveUrl || null,
          githubUrl: formGithubUrl || null,
          isFeatured: formFeatured,
          order: Number(formOrder),
          isPublished: formPublished,
        });

        if (res.success && res.data) {
          setProjects((prev) =>
            sortProjectsByOrder(
              prev.map((p) => (p.id === editingProject.id ? (res.data as ProjectData) : p))
            )
          );
          setIsModalOpen(false);
          setEditingProject(null);
          setStatusMessage({ type: "success", text: "Project updated successfully!" });
        } else {
          setStatusMessage({ type: "error", text: res.error || "Failed to update project." });
        }
      } else {
        const res = await createProjectAction({
          title: formTitle,
          slug: formSlug,
          description: formDescription,
          imageUrl: formImageUrl || null,
          technologies: techArray,
          liveUrl: formLiveUrl || null,
          githubUrl: formGithubUrl || null,
          isFeatured: formFeatured,
          order: Number(formOrder),
          isPublished: formPublished,
        });

        if (res.success && res.data) {
          setProjects((prev) => sortProjectsByOrder([...prev, res.data as ProjectData]));
          setIsModalOpen(false);
          setEditingProject(null);
          setStatusMessage({ type: "success", text: "New project created successfully!" });
        } else {
          setStatusMessage({ type: "error", text: res.error || "Failed to create project." });
        }
      }
    } catch {
      setStatusMessage({ type: "error", text: "An error occurred while saving." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await deleteProjectAction(id);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setDeleteConfirmId(null);
        setStatusMessage({ type: "success", text: "Project deleted successfully." });
      } else {
        setStatusMessage({ type: "error", text: res.error || "Failed to delete project." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (project: ProjectData) => {
    const updated = !project.isPublished;
    const res = await toggleProjectPublishAction(project.id, updated);
    if (res.success) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, isPublished: updated } : p))
      );
    }
  };

  const handleToggleFeatured = async (project: ProjectData) => {
    const updated = !project.isFeatured;
    const res = await toggleProjectFeaturedAction(project.id, updated);
    if (res.success) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, isFeatured: updated } : p))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#303030]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Project Management
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-1 font-mono">
            Full control over portfolio projects, live demos, repositories, and featured status.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#84CC16] text-[#111111] font-bold text-xs hover:bg-[#65A30D] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Project</span>
        </button>
      </div>

      {/* Global Status Alert */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            statusMessage.type === "success"
              ? "bg-[#84CC16]/10 border-[#84CC16]/40 text-[#84CC16]"
              : "bg-red-950/40 border-red-800 text-red-300"
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-[#1A1A1A] border border-[#303030] rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-[#84CC16]/50 transition-colors shadow-lg"
          >
            {/* Top Thumbnail / Placeholder */}
            <div>
              <div className="relative w-full h-44 bg-[#141414] border-b border-[#303030] overflow-hidden">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    sizes="400px"
                    className="object-cover"
                    unoptimized={project.imageUrl.startsWith("data:")}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <FolderKanban className="w-8 h-8 text-[#84CC16] mb-2" />
                    <span className="text-xs font-semibold text-white">
                      {project.title}
                    </span>
                  </div>
                )}

                {/* Featured Badge */}
                <button
                  onClick={() => handleToggleFeatured(project)}
                  className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md border transition-colors ${
                    project.isFeatured
                      ? "bg-[#111111]/90 border-[#84CC16] text-[#84CC16]"
                      : "bg-[#111111]/80 border-[#303030] text-[#737373] hover:text-white"
                  }`}
                  title={project.isFeatured ? "Unmark as featured" : "Mark as featured"}
                >
                  <Star className={`w-3.5 h-3.5 ${project.isFeatured ? "fill-[#84CC16]" : ""}`} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-white group-hover:text-[#84CC16] transition-colors">
                    {project.title}
                  </h3>
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#111111] border border-[#303030] text-[#84CC16] shrink-0"
                    title={`Display Order: ${project.order}`}
                  >
                    Order: #{project.order}
                  </span>
                </div>

                <p className="text-xs text-[#A3A3A3] line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono text-[#A3A3A3] bg-[#111111] px-2 py-0.5 rounded border border-[#303030]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="text-[10px] font-mono text-[#737373] px-1 py-0.5">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* URLs info */}
                <div className="flex items-center gap-3 pt-2 text-xs">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#84CC16] hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Live</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#A3A3A3] hover:text-white flex items-center gap-1 font-mono text-[11px]"
                    >
                      <GithubIcon className="w-3 h-3" />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-[#141414] border-t border-[#303030] flex items-center justify-between">
              <button
                onClick={() => handleTogglePublish(project)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold transition-colors ${
                  project.isPublished
                    ? "bg-[#84CC16]/10 border border-[#84CC16]/30 text-[#84CC16]"
                    : "bg-[#252525] border border-[#404040] text-[#737373]"
                }`}
              >
                {project.isPublished ? (
                  <>
                    <Eye className="w-3 h-3" />
                    <span>Published</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3" />
                    <span>Draft</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(project)}
                  className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-[#84CC16] hover:bg-[#252525] transition-colors"
                  title="Edit project"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(project.id)}
                  className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-red-400 hover:bg-red-950/30 transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Delete Project</h3>
            <p className="text-xs text-[#A3A3A3]">
              Are you sure you want to delete this project? This will remove it from the PostgreSQL database and public portfolio immediately.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-xs font-semibold text-[#A3A3A3] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#303030]">
              <h3 className="text-base font-bold text-white">
                {editingProject ? "Edit Project" : "Create New Project"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#A3A3A3] hover:text-white hover:bg-[#252525]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {statusMessage && statusMessage.type === "error" && (
              <div className="p-3 mb-3 rounded-xl text-xs bg-red-950/40 border border-red-800 text-red-300">
                {statusMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Artora"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. artora"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                  />
                </div>
              </div>

              {/* Big Description Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono font-semibold text-[#A3A3A3] uppercase">
                    Detailed Project Description *
                  </label>
                  <span className="text-[11px] font-mono text-[#737373]">
                    {formDescription.length} characters
                  </span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Write a comprehensive description of your project:&#10;• What is the purpose of this project?&#10;• Core features, user workflows, and capabilities&#10;• Technical architecture & challenges solved&#10;• Future roadmap or impact..."
                  className="w-full px-4 py-3 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs sm:text-sm focus:border-[#84CC16] focus:outline-none resize-y min-h-[170px] leading-relaxed"
                />
                <p className="text-[11px] text-[#737373] mt-1 font-mono">
                  Line breaks and formatted paragraphs will be displayed in full inside the visitor &quot;View Details&quot; modal.
                </p>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                  Technologies (Comma Separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formTechnologies}
                  onChange={(e) => setFormTechnologies(e.target.value)}
                  placeholder="e.g. React, Next.js, Node.js, Express, MongoDB, Tailwind CSS"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                />
              </div>

              {/* URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formLiveUrl}
                    onChange={(e) => setFormLiveUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={formGithubUrl}
                    onChange={(e) => setFormGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                  />
                </div>
              </div>

              {/* Thumbnail Image: File Upload & Live Preview */}
              <div>
                <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1.5 uppercase">
                  Project Image / Card Thumbnail
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                {formImageUrl ? (
                  <div className="p-3 rounded-xl bg-[#111111] border border-[#303030] space-y-3">
                    <div className="relative w-full h-40 bg-[#161616] rounded-lg overflow-hidden border border-[#252525]">
                      <Image
                        src={formImageUrl}
                        alt="Project Preview"
                        fill
                        className="object-cover"
                        unoptimized={formImageUrl.startsWith("data:")}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#84CC16] font-mono flex items-center gap-1.5 truncate">
                        <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Image selected</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="px-3 py-1.5 rounded-lg bg-[#202020] border border-[#303030] text-white text-xs hover:border-[#84CC16] hover:text-[#84CC16] transition-colors flex items-center gap-1.5"
                        >
                          {uploadingImage ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5 text-[#84CC16]" />
                          )}
                          <span>Change File</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormImageUrl("")}
                          className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/60 text-red-300 text-xs hover:bg-red-900/50 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer border-2 border-dashed border-[#303030] hover:border-[#84CC16] bg-[#111111] hover:bg-[#141414] rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center transition-all group"
                    >
                      {uploadingImage ? (
                        <div className="flex items-center gap-2 text-xs text-[#84CC16]">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing & optimizing image...</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#303030] group-hover:border-[#84CC16] flex items-center justify-center text-[#84CC16] mb-2 transition-colors">
                            <Upload className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-semibold text-white group-hover:text-[#84CC16] transition-colors">
                            Click to upload image file from device
                          </span>
                          <span className="text-[11px] text-[#737373] mt-0.5 font-mono">
                            Supports PNG, JPG, WebP, GIF, SVG (auto-optimized)
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="Or paste external image URL (https://...)"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                    Display Order (1 = 1st, 2 = 2nd...)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                  />
                  <p className="text-[10px] text-[#737373] mt-1 font-mono">
                    Lower number comes first (1 = 1st, 2 = 2nd, etc.)
                  </p>
                </div>

                <div className="flex flex-col justify-end space-y-2 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="rounded border-[#303030] bg-[#111111] text-[#84CC16] focus:ring-0 w-4 h-4"
                    />
                    <span className="text-xs text-white">Mark as Featured</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formPublished}
                      onChange={(e) => setFormPublished(e.target.checked)}
                      className="rounded border-[#303030] bg-[#111111] text-[#84CC16] focus:ring-0 w-4 h-4"
                    />
                    <span className="text-xs text-white">Published immediately</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#303030]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#111111] border border-[#303030] text-xs font-semibold text-[#A3A3A3] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#84CC16] text-[#111111] text-xs font-bold hover:bg-[#65A30D] disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
