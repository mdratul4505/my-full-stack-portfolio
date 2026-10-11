"use client";

import React, { useState } from "react";
import {
  createEducationAction,
  updateEducationAction,
  deleteEducationAction,
} from "@/server/actions/education";
import {
  Plus,
  Pencil,
  Trash2,
  GraduationCap,
  Calendar,
  X,
} from "lucide-react";

interface EducationData {
  id: string;
  institution: string;
  department: string;
  degree?: string | null;
  semester?: string | null;
  startYear?: string | null;
  endYear?: string | null;
  cgpa?: string | null;
  description?: string | null;
  order: number;
}

interface EducationManagerClientProps {
  initialEducation: EducationData[];
}

export function EducationManagerClient({ initialEducation }: EducationManagerClientProps) {
  const [educationList, setEducationList] = useState<EducationData[]>(initialEducation);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formInstitution, setFormInstitution] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formDegree, setFormDegree] = useState("");
  const [formSemester, setFormSemester] = useState("");
  const [formStartYear, setFormStartYear] = useState("");
  const [formEndYear, setFormEndYear] = useState("");
  const [formCgpa, setFormCgpa] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formOrder, setFormOrder] = useState(0);

  const openAddModal = () => {
    setEditingItem(null);
    setFormInstitution("");
    setFormDepartment("");
    setFormDegree("Diploma in Engineering");
    setFormSemester("");
    setFormStartYear("");
    setFormEndYear("");
    setFormCgpa("");
    setFormDescription("");
    setFormOrder(educationList.length + 1);
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: EducationData) => {
    setEditingItem(item);
    setFormInstitution(item.institution);
    setFormDepartment(item.department);
    setFormDegree(item.degree || "");
    setFormSemester(item.semester || "");
    setFormStartYear(item.startYear || "");
    setFormEndYear(item.endYear || "");
    setFormCgpa(item.cgpa || "");
    setFormDescription(item.description || "");
    setFormOrder(item.order);
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      if (editingItem) {
        const res = await updateEducationAction(editingItem.id, {
          institution: formInstitution,
          department: formDepartment,
          degree: formDegree || null,
          semester: formSemester || null,
          startYear: formStartYear || null,
          endYear: formEndYear || null,
          cgpa: formCgpa || null,
          description: formDescription || null,
          order: Number(formOrder),
        });

        if (res.success && res.data) {
          setEducationList((prev) =>
            prev.map((e) => (e.id === editingItem.id ? (res.data as EducationData) : e))
          );
          setIsModalOpen(false);
          setStatusMessage({ type: "success", text: "Education record updated successfully!" });
        } else {
          setStatusMessage({ type: "error", text: res.error || "Failed to update record." });
        }
      } else {
        const res = await createEducationAction({
          institution: formInstitution,
          department: formDepartment,
          degree: formDegree || null,
          semester: formSemester || null,
          startYear: formStartYear || null,
          endYear: formEndYear || null,
          cgpa: formCgpa || null,
          description: formDescription || null,
          order: Number(formOrder),
        });

        if (res.success && res.data) {
          setEducationList((prev) => [...prev, res.data as EducationData]);
          setIsModalOpen(false);
          setStatusMessage({ type: "success", text: "New education record added successfully!" });
        } else {
          setStatusMessage({ type: "error", text: res.error || "Failed to create record." });
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
      const res = await deleteEducationAction(id);
      if (res.success) {
        setEducationList((prev) => prev.filter((e) => e.id !== id));
        setDeleteConfirmId(null);
        setStatusMessage({ type: "success", text: "Education record deleted." });
      } else {
        setStatusMessage({ type: "error", text: res.error || "Failed to delete record." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#303030]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Education Management
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-1 font-mono">
            Manage academic institutions, CST semesters, and qualifications.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#84CC16] text-[#111111] font-bold text-xs hover:bg-[#65A30D] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
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
          <button onClick={() => setStatusMessage(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Education List */}
      <div className="space-y-4">
        {educationList.map((item) => (
          <div
            key={item.id}
            className="bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#84CC16]/40 transition-colors"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-5 h-5 text-[#84CC16]" />
                <h3 className="text-base font-bold text-white">
                  {item.institution}
                </h3>
              </div>

              <p className="text-xs font-medium text-[#84CC16]">
                {item.department} {item.degree ? `(${item.degree})` : ""}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#A3A3A3] pt-1">
                {(item.startYear || item.endYear) && (
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-[#84CC16]" />
                    <span>{item.startYear} - {item.endYear || "Present"}</span>
                  </span>
                )}

                {item.semester && (
                  <span className="px-2 py-0.5 rounded bg-[#111111] border border-[#303030] text-[10px] font-mono text-[#84CC16]">
                    {item.semester}
                  </span>
                )}

                {item.cgpa && (
                  <span className="px-2 py-0.5 rounded bg-[#111111] border border-[#303030] text-[10px] font-mono text-white">
                    CGPA: <strong className="text-[#84CC16]">{item.cgpa}</strong>
                  </span>
                )}
              </div>

              {item.description && (
                <p className="text-xs text-[#A3A3A3] pt-1 max-w-2xl">
                  {item.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
              <button
                onClick={() => openEditModal(item)}
                className="p-2 rounded-xl bg-[#111111] border border-[#303030] text-[#A3A3A3] hover:text-[#84CC16] hover:border-[#84CC16] transition-colors"
                title="Edit record"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteConfirmId(item.id)}
                className="p-2 rounded-xl bg-[#111111] border border-[#303030] text-[#A3A3A3] hover:text-red-400 hover:border-red-500 transition-colors"
                title="Delete record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Delete Record</h3>
            <p className="text-xs text-[#A3A3A3]">
              Are you sure you want to delete this education entry? It will be removed from PostgreSQL and the public portfolio.
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

      {/* Add / Edit Education Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#303030]">
              <h3 className="text-base font-bold text-white">
                {editingItem ? "Edit Education" : "Add Education Record"}
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
                  Institution Name *
                </label>
                <input
                  type="text"
                  required
                  value={formInstitution}
                  onChange={(e) => setFormInstitution(e.target.value)}
                  placeholder="Satkhira Polytechnic Institute"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    placeholder="Computer Science & Technology (CST)"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={formDegree}
                    onChange={(e) => setFormDegree(e.target.value)}
                    placeholder="Diploma in Engineering"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                    Semester
                  </label>
                  <input
                    type="text"
                    value={formSemester}
                    onChange={(e) => setFormSemester(e.target.value)}
                    placeholder="e.g. 6th Semester"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                    Start Year
                  </label>
                  <input
                    type="text"
                    value={formStartYear}
                    onChange={(e) => setFormStartYear(e.target.value)}
                    placeholder="e.g. 2022"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                    End Year
                  </label>
                  <input
                    type="text"
                    value={formEndYear}
                    onChange={(e) => setFormEndYear(e.target.value)}
                    placeholder="e.g. 2026 (Expected)"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                    CGPA (Optional)
                  </label>
                  <input
                    type="text"
                    value={formCgpa}
                    onChange={(e) => setFormCgpa(e.target.value)}
                    placeholder="e.g. 3.85 (or leave empty)"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                  />
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
                  Curriculum / Description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Focus areas, key coursework, or achievements..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none resize-none"
                />
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
                  {isSubmitting ? "Saving..." : editingItem ? "Update Education" : "Add Education"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
