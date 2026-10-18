"use client";

import React, { useState } from "react";
import { updateSettingsAction } from "@/server/actions/settings";
import { SettingsInput } from "@/lib/validations";
import {
  Save,
  Loader2,
  CheckCircle2,
  Settings,
  Mail,
  Phone,
  FileDown,
  Globe,
  Briefcase,
  X,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/BrandIcons";

interface SettingsManagerClientProps {
  initialSettings: SettingsInput;
}

export function SettingsManagerClient({ initialSettings }: SettingsManagerClientProps) {
  const [settings, setSettings] = useState<SettingsInput>(initialSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Auto-hide status message after 3.5s
  React.useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await updateSettingsAction(settings);
      if (res.success) {
        setStatusMessage({
          type: "success",
          text: "Portfolio settings updated and synchronized across all pages!",
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
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-[#84CC16]" />
          <span>System & Portfolio Settings</span>
        </h1>
        <p className="text-xs text-[#A3A3A3] mt-1 font-mono">
          Configure social connections, resume link, recipient contact email, and availability status.
        </p>
      </div>

      {/* Global Status Message */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-2.5 border ${
            statusMessage.type === "success"
              ? "bg-[#84CC16]/10 border-[#84CC16]/40 text-[#84CC16]"
              : "bg-red-950/40 border-red-800 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="p-1 hover:opacity-75 transition-opacity"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Email & Form Notifications */}
        <div className="bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 sm:p-7 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#84CC16]" />
            <span>Email Routing & Inquiries</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                Public Display Email *
              </label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
              />
              <p className="text-[10px] text-[#737373] mt-1 font-mono">
                Shown publicly on the website for visitors to reach you directly.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase">
                Contact Form Forwarding Address
              </label>
              <input
                type="email"
                value={settings.contactEmail || ""}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                placeholder="dev.ratul.coder@gmail.com"
                className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
              />
              <p className="text-[10px] text-[#737373] mt-1 font-mono">
                Where email notifications are delivered via Resend.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>Contact Phone Number</span>
              </label>
              <input
                type="tel"
                value={settings.phone || ""}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="01985435655"
                className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
              />
              <p className="text-[10px] text-[#737373] mt-1 font-mono">
                Displayed in the Contact section for direct phone calls.
              </p>
            </div>
          </div>
        </div>

        {/* Social Profile Links */}
        <div className="bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 sm:p-7 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#84CC16]" />
            <span>Verified Social Profiles</span>
          </h2>
          <p className="text-xs text-[#A3A3A3]">
            Only verified links with values will appear on the public hero and footer.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase flex items-center gap-1.5">
                <GithubIcon className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>GitHub URL</span>
              </label>
              <input
                type="url"
                value={settings.githubUrl || ""}
                onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
                placeholder="https://github.com/mdratul4505"
                className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase flex items-center gap-1.5">
                <LinkedinIcon className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>LinkedIn URL</span>
              </label>
              <input
                type="url"
                value={settings.linkedinUrl || ""}
                onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase flex items-center gap-1.5">
                <TwitterIcon className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>Twitter / X URL</span>
              </label>
              <input
                type="url"
                value={settings.twitterUrl || ""}
                onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                placeholder="https://x.com/..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Resume & Job Status */}
        <div className="bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 sm:p-7 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#84CC16]" />
            <span>Resume & Work Status</span>
          </h2>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1 uppercase flex items-center gap-1.5">
              <FileDown className="w-3.5 h-3.5 text-[#84CC16]" />
              <span>Resume Download Link / Google Drive / PDF URL</span>
            </label>
            <input
              type="text"
              value={settings.resumeUrl || ""}
              onChange={(e) => setSettings({ ...settings, resumeUrl: e.target.value })}
              placeholder="https://drive.google.com/... or /resume.pdf"
              className="w-full px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-white text-xs focus:border-[#84CC16] focus:outline-none"
            />
            <p className="text-[10px] text-[#737373] mt-1 font-mono">
              When configured, the &apos;Download Resume&apos; button appears in the navbar.
            </p>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.availableForWork}
                onChange={(e) => setSettings({ ...settings, availableForWork: e.target.checked })}
                className="rounded border-[#303030] bg-[#111111] text-[#84CC16] focus:ring-0 w-4 h-4"
              />
              <span className="text-xs text-white font-medium">
                Show &apos;Available for New Opportunities&apos; badge in hero section
              </span>
            </label>
          </div>
        </div>

        {/* Save Button */}
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
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
