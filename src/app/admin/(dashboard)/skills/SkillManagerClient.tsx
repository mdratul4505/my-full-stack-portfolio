"use client";

import React, { useState } from "react";
import {
  createSkillAction,
  updateSkillAction,
  deleteSkillAction,
  toggleSkillPublishAction,
} from "@/server/actions/skills";
import { SKILL_CATEGORIES } from "@/lib/validations";
import { SkillIcon } from "@/components/portfolio/SkillIcon";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

interface SkillData {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  proficiency?: string | null;
  order: number;
  isPublished: boolean;
}

interface SkillManagerClientProps {
  initialSkills: SkillData[];
}

const COMMON_ICONS = [
  "Code2",
  "Palette",
  "FileCode",
  "FileCode2",
  "Atom",
  "Layers",
  "Wind",
  "Sparkles",
  "Server",
  "Cpu",
  "Globe",
  "Database",
  "HardDrive",
  "Boxes",
  "Laptop",
  "GitBranch",
  "Github",
  "Send",
  "CloudUpload",
  "Cloud",
  "Terminal",
  "Zap",
  "Shield",
];

export function SkillManagerClient({ initialSkills }: SkillManagerClientProps) {
  const [skills, setSkills] = useState<SkillData[]>(initialSkills);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<string>(SKILL_CATEGORIES[0]);
  const [formIcon, setFormIcon] = useState("Code2");
  const [formProficiency, setFormProficiency] = useState("");
  const [formOrder, setFormOrder] = useState(0);
  const [formPublished, setFormPublished] = useState(true);

  const openAddModal = () => {
    setEditingSkill(null);
    setFormName("");
    setFormCategory(SKILL_CATEGORIES[0]);
    setFormIcon("Code2");
    setFormProficiency("");
    setFormOrder(0);
    setFormPublished(true);
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (skill: SkillData) => {
    setEditingSkill(skill);
    setFormName(skill.name);
    setFormCategory(skill.category);
    setFormIcon(skill.icon || "Code2");
    setFormProficiency(skill.proficiency || "");
    setFormOrder(skill.order);
    setFormPublished(skill.isPublished);
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      if (editingSkill) {
        // Update
        const res = await updateSkillAction(editingSkill.id, {
          name: formName,
          category: formCategory as (typeof SKILL_CATEGORIES)[number],
          icon: formIcon,
          proficiency: formProficiency || null,
          order: Number(formOrder),
          isPublished: formPublished,
        });

        if (res.success && res.data) {
          setSkills((prev) =>
            prev.map((s) => (s.id === editingSkill.id ? (res.data as SkillData) : s))
          );
          setIsModalOpen(false);
          setStatusMessage({ type: "success", text: "Skill updated successfully!" });
        } else {
          setStatusMessage({ type: "error", text: res.error || "Failed to update skill." });
        }
      } else {
        // Create
        const res = await createSkillAction({
          name: formName,
          category: formCategory as (typeof SKILL_CATEGORIES)[number],
          icon: formIcon,
          proficiency: formProficiency || null,
          order: Number(formOrder),
          isPublished: formPublished,
        });

        if (res.success && res.data) {
          setSkills((prev) => [res.data as SkillData, ...prev]);
          setIsModalOpen(false);
          setStatusMessage({ type: "success", text: "New skill created successfully!" });
        } else {
          setStatusMessage({ type: "error", text: res.error || "Failed to create skill." });
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
      const res = await deleteSkillAction(id);
      if (res.success) {
        setSkills((prev) => prev.filter((s) => s.id !== id));
        setDeleteConfirmId(null);
        setStatusMessage({ type: "success", text: "Skill deleted successfully." });
      } else {
        setStatusMessage({ type: "error", text: res.error || "Failed to delete skill." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (skill: SkillData) => {
    const updatedStatus = !skill.isPublished;
    const res = await toggleSkillPublishAction(skill.id, updatedStatus);
    if (res.success) {
      setSkills((prev) =>
        prev.map((s) => (s.id === skill.id ? { ...s, isPublished: updatedStatus } : s))
      );
    }
  };

  const filteredSkills =
    activeCategory === "ALL"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#303030]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Skill Management
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-1 font-mono">
            Database-backed skills categorized into 4 core areas for the portfolio.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#84CC16] text-[#111111] font-bold text-xs hover:bg-[#65A30D] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {/* Global Status Message */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
            statusMessage.type === "success"
              ? "bg-[#84CC16]/10 border-[#84CC16]/40 text-[#84CC16]"
              : "bg-red-950/40 border-red-800 text-red-300"
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="p-1 hover:opacity-75"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeCategory === "ALL"
              ? "bg-[#84CC16] text-[#111111]"
              : "bg-[#1A1A1A] border border-[#303030] text-[#A3A3A3] hover:text-white"
          }`}
        >
          All ({skills.length})
        </button>
        {SKILL_CATEGORIES.map((cat) => {
          const count = skills.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? "bg-[#84CC16] text-[#111111]"
                  : "bg-[#1A1A1A] border border-[#303030] text-[#A3A3A3] hover:text-white"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Skills Table / List */}
      <div className="bg-[#1A1A1A] border border-[#303030] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141414] border-b border-[#303030] text-[#A3A3A3] font-mono uppercase">
              <tr>
                <th className="py-3 px-4">Icon & Skill</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Proficiency</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#303030]/60">
              {filteredSkills.map((skill) => (
                <tr
                  key={skill.id}
                  className="hover:bg-[#202020] transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[#303030] flex items-center justify-center shrink-0">
                        <SkillIcon iconName={skill.icon} className="w-4 h-4 text-[#84CC16]" />
                      </div>
                      <span className="font-semibold text-white">{skill.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#A3A3A3]">
                    {skill.category}
                  </td>
                  <td className="py-3 px-4">
                    {skill.proficiency ? (
                      <span className="px-2 py-0.5 rounded bg-[#111111] border border-[#303030] text-[10px] font-mono text-[#84CC16]">
                        {skill.proficiency}
                      </span>
                    ) : (
                      <span className="text-[#666]">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#A3A3A3]">
                    {skill.order}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleTogglePublish(skill)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold transition-colors ${
                        skill.isPublished
                          ? "bg-[#84CC16]/10 border border-[#84CC16]/30 text-[#84CC16]"
                          : "bg-[#252525] border border-[#404040] text-[#737373]"
                      }`}
                    >
                      {skill.isPublished ? (
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
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(skill)}
                        className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-[#84CC16] hover:bg-[#252525] transition-colors"
                        title="Edit skill"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(skill.id)}
                        className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-red-400 hover:bg-red-950/30 transition-colors"
                        title="Delete skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Confirm Deletion</h3>
            <p className="text-xs text-[#A3A3A3]">
              Are you sure you want to delete this skill? It will be removed immediately from PostgreSQL and the public portfolio.
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

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#303030]">
              <h3 className="text-base font-bold text-white">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#A3A3A3] hover:text-white hover:bg-[#252525]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Next.js"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                  Category *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                >
                  {SKILL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                    Icon Identifier
                  </label>
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                  >
                    {COMMON_ICONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                  Proficiency Label (Optional)
                </label>
                <input
                  type="text"
                  value={formProficiency}
                  onChange={(e) => setFormProficiency(e.target.value)}
                  placeholder="e.g. Advanced, Proficient, Familiar"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="skillPublish"
                  checked={formPublished}
                  onChange={(e) => setFormPublished(e.target.checked)}
                  className="rounded border-[#303030] bg-[#111111] text-[#84CC16] focus:ring-0 w-4 h-4"
                />
                <label htmlFor="skillPublish" className="text-xs text-white">
                  Publish to portfolio website immediately
                </label>
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
                  {isSubmitting ? "Saving..." : editingSkill ? "Update Skill" : "Create Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
