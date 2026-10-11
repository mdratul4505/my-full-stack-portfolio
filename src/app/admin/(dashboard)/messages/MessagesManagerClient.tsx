"use client";

import React, { useState } from "react";
import {
  markMessageReadAction,
  deleteMessageAction,
} from "@/server/actions/messages";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import {
  Mail,
  MailOpen,
  Trash2,
  X,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

interface ContactMessageData {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  ipAddress?: string | null;
  createdAt: string | Date;
}

interface MessagesManagerClientProps {
  initialMessages: ContactMessageData[];
}

export function MessagesManagerClient({ initialMessages }: MessagesManagerClientProps) {
  const [messages, setMessages] = useState<ContactMessageData[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const handleOpenMessage = async (msg: ContactMessageData) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      // Mark as read in DB and local state
      await markMessageReadAction(msg.id, true);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
      );
    }
  };

  const handleToggleRead = async (msg: ContactMessageData, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = !msg.isRead;
    await markMessageReadAction(msg.id, updated);
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, isRead: updated } : m))
    );
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage((prev) => (prev ? { ...prev, isRead: updated } : null));
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await deleteMessageAction(id);
      if (res.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
        setDeleteConfirmId(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === "unread") return !m.isRead;
    if (filter === "read") return m.isRead;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#303030]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-[#84CC16]" />
            <span>Messages Inbox</span>
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-1 font-mono">
            Submissions received from the public portfolio contact form.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#1A1A1A] p-1 rounded-xl border border-[#303030]">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === "all"
                ? "bg-[#84CC16] text-[#111111]"
                : "text-[#A3A3A3] hover:text-white"
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === "unread"
                ? "bg-[#84CC16] text-[#111111]"
                : "text-[#A3A3A3] hover:text-white"
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === "read"
                ? "bg-[#84CC16] text-[#111111]"
                : "text-[#A3A3A3] hover:text-white"
            }`}
          >
            Read ({messages.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="bg-[#1A1A1A] border border-[#303030] rounded-2xl p-16 text-center text-[#A3A3A3]">
          <MessageSquare className="w-10 h-10 mx-auto text-[#404040] mb-3" />
          <p className="text-sm font-medium">No messages found in this view.</p>
        </div>
      ) : (
        <div className="bg-[#1A1A1A] border border-[#303030] rounded-2xl overflow-hidden shadow-xl">
          <div className="divide-y divide-[#303030]/60">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                  !msg.isRead
                    ? "bg-[#181818] hover:bg-[#202020]"
                    : "bg-transparent hover:bg-[#1E1E1E]"
                }`}
              >
                {/* Left: Sender & Subject */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="pt-0.5">
                    {!msg.isRead ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#84CC16] inline-block shadow-[0_0_8px_#84CC16]" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#404040] inline-block" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs ${
                          !msg.isRead ? "font-bold text-white" : "font-semibold text-[#D4D4D4]"
                        }`}
                      >
                        {msg.name}
                      </span>
                      <span className="text-[11px] text-[#737373] font-mono">
                        &lt;{msg.email}&gt;
                      </span>
                    </div>

                    <h3
                      className={`text-xs mt-0.5 truncate ${
                        !msg.isRead ? "font-bold text-[#84CC16]" : "text-[#A3A3A3]"
                      }`}
                    >
                      {msg.subject}
                    </h3>

                    <p className="text-[11px] text-[#737373] line-clamp-1 mt-0.5">
                      {msg.message}
                    </p>
                  </div>
                </div>

                {/* Right: Date & Quick Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#303030]/40">
                  <span className="text-[10px] text-[#737373] font-mono">
                    {formatRelativeTime(msg.createdAt)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleToggleRead(msg, e)}
                      className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-[#84CC16] hover:bg-[#252525] transition-colors"
                      title={msg.isRead ? "Mark as unread" : "Mark as read"}
                    >
                      {msg.isRead ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5 text-[#84CC16]" />}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(msg.id);
                      }}
                      className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-red-400 hover:bg-red-950/30 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message View Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#303030]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#84CC16] tracking-wider block mb-1">
                  Message Details
                </span>
                <h2 className="text-lg font-bold text-white">
                  {selectedMessage.subject}
                </h2>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-white hover:bg-[#252525]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sender Metadata */}
            <div className="bg-[#111111] p-4 rounded-xl border border-[#303030] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#A3A3A3]">From:</span>
                <span className="text-white font-semibold">
                  {selectedMessage.name} (&lt;{selectedMessage.email}&gt;)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A3A3A3]">Received:</span>
                <span className="text-[#A3A3A3] font-mono">
                  {formatDate(selectedMessage.createdAt)}
                </span>
              </div>
              {selectedMessage.ipAddress && (
                <div className="flex items-center justify-between">
                  <span className="text-[#A3A3A3]">IP Address:</span>
                  <span className="text-[#737373] font-mono">
                    {selectedMessage.ipAddress}
                  </span>
                </div>
              )}
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#A3A3A3] mb-2">
                Message Content:
              </label>
              <div className="p-4 rounded-xl bg-[#141414] border border-[#303030] text-xs sm:text-sm text-[#D4D4D4] whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#303030]">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#84CC16] text-[#111111] font-bold text-xs hover:bg-[#65A30D] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Reply via Email</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(selectedMessage.id)}
                  className="px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs font-semibold hover:bg-red-900/50 transition-colors"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-3.5 py-2 rounded-xl bg-[#111111] border border-[#303030] text-xs font-semibold text-[#A3A3A3] hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Delete Message</h3>
            <p className="text-xs text-[#A3A3A3]">
              Are you sure you want to permanently delete this message? This action cannot be undone.
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
    </div>
  );
}
