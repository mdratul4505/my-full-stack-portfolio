"use client";

import React, { useState, useRef } from "react";
import { updateSettingsAction } from "@/server/actions/settings";
import { uploadImageAction } from "@/server/actions/upload";
import { compressImageFile } from "@/lib/client-image";
import { SettingsInput } from "@/lib/validations";
import { Save, Upload, Loader2, CheckCircle2, User, FileText, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface AboutManagerClientProps {
  initialSettings: {
    name: string;
    headline: string;
    shortBio: string;
    aboutText: string;
    profileImage?: string | null;
    resumeUrl?: string | null;
    email: string;
    contactEmail?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    availableForWork: boolean;
  };
}

export function AboutManagerClient({ initialSettings }: AboutManagerClientProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setStatusMessage(null);

    try {
      let uploadedUrl: string | null = null;
      try {
        uploadedUrl = await compressImageFile(file, 1200, 0.85);
      } catch (cErr) {
        console.warn("Client compression failed, falling back to server:", cErr);
        const formData = new FormData();
        formData.append("file", file);
        const actionRes = await uploadImageAction(formData);
        if (actionRes.success && actionRes.url) {
          uploadedUrl = actionRes.url;
        } else {
          setStatusMessage({
            type: "error",
            text: actionRes.error || "Image upload failed. Please try again.",
          });
          return;
        }
      }

      if (uploadedUrl) {
        setSettings((prev) => ({ ...prev, profileImage: uploadedUrl }));

        // Automatically save to PostgreSQL database immediately
        const saveRes = await updateSettingsAction({
          name: settings.name,
          headline: settings.headline,
          shortBio: settings.shortBio,
          aboutText: settings.aboutText,
          profileImage: uploadedUrl,
          resumeUrl: settings.resumeUrl || null,
          email: settings.email,
          contactEmail: settings.contactEmail || null,
          githubUrl: settings.githubUrl || null,
          linkedinUrl: settings.linkedinUrl || null,
          twitterUrl: settings.twitterUrl || null,
          availableForWork: settings.availableForWork,
        });

        if (saveRes.success) {
          setStatusMessage({
            type: "success",
            text: "Profile photo uploaded and saved successfully! Your website is updated.",
          });
        } else {
          setStatusMessage({
            type: "success",
            text: "Profile photo uploaded! Click 'Save About & Bio' below to confirm.",
          });
        }
      }
    } catch (err: unknown) {
      console.error("Upload error:", err);
      setStatusMessage({ type: "error", text: "Error during image upload." });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const payload: SettingsInput = {
        name: settings.name,
        headline: settings.headline,
        shortBio: settings.shortBio,
        aboutText: settings.aboutText,
        profileImage: settings.profileImage || null,
        resumeUrl: settings.resumeUrl || null,
        email: settings.email,
        contactEmail: settings.contactEmail || null,
        githubUrl: settings.githubUrl || null,
        linkedinUrl: settings.linkedinUrl || null,
        twitterUrl: settings.twitterUrl || null,
        availableForWork: settings.availableForWork,
      };

      const res = await updateSettingsAction(payload);
      if (res.success) {
        setStatusMessage({
          type: "success",
          text: "About section & profile updated successfully! Changes are live on the portfolio.",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to update settings.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "An unexpected error occurred while saving.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-[#303030]">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          About & Profile Management
        </h1>
        <p className="text-xs text-[#A3A3A3] mt-1 font-mono">
          Manage your personal biography, headline, profile image, and career narrative.
        </p>
      </div>

      {/* Global Status Message */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 border ${
            statusMessage.type === "success"
              ? "bg-[#84CC16]/10 border-[#84CC16]/40 text-[#84CC16]"
              : "bg-red-950/40 border-red-800 text-red-300"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card & Avatar */}
        <div className="bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 sm:p-7 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-[#84CC16]" />
            <span>Profile Photo & Identity</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-28 h-28 rounded-2xl bg-[#111111] border border-[#303030] overflow-hidden shrink-0 flex items-center justify-center">
              {settings.profileImage ? (
                <Image
                  src={settings.profileImage}
                  alt={settings.name}
                  fill
                  className="object-cover object-top"
                  unoptimized
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#A3A3A3]">
                  <ImageIcon className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-mono">No Image</span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 w-full">
              <label className="block text-xs font-mono font-semibold text-[#A3A3A3] uppercase">
                Profile Photo URL or Upload
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.profileImage || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, profileImage: e.target.value })
                  }
                  placeholder="/uploads/myphoto.jpg or https://..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#252525] border border-[#303030] text-xs font-semibold text-white hover:border-[#84CC16] transition-colors shrink-0"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-[#84CC16]" />
                  )}
                  <span>Upload</span>
                </button>
              </div>
              <p className="text-[11px] text-[#737373]">
                Supports JPEG, PNG, WebP up to 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Headlines and Bios */}
        <div className="bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 sm:p-7 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#84CC16]" />
            <span>Headlines & Introduction</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                Display Name *
              </label>
              <input
                type="text"
                required
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                Professional Headline *
              </label>
              <input
                type="text"
                required
                value={settings.headline}
                onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
              Short Bio (Hero Section) *
            </label>
            <textarea
              rows={2}
              required
              value={settings.shortBio}
              onChange={(e) => setSettings({ ...settings, shortBio: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
              Detailed About Narrative (About Section) *
            </label>
            <textarea
              rows={6}
              required
              value={settings.aboutText}
              onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
              placeholder="Explain your learning journey, technical focus, and CST education at Satkhira Polytechnic Institute..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none resize-none leading-relaxed"
            />
            <p className="text-[11px] text-[#737373] mt-1 font-mono">
              Tip: Separate paragraphs with double newlines.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#84CC16] text-[#111111] font-bold text-xs hover:bg-[#65A30D] transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save About & Bio</span>
          </button>
        </div>
      </form>
    </div>
  );
}
