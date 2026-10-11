"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactInput } from "@/lib/validations";
import { submitContactAction } from "@/server/actions/contact";
import { SlideUp } from "./MotionWrappers";
import { Mail, Phone, Send, CheckCircle2, AlertCircle, Loader2, MessageSquare, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ContactSectionProps {
  email?: string | null;
  phone?: string | null;
  name: string;
}

export function ContactSection({ email, phone, name }: ContactSectionProps) {
  const [serverStatus, setServerStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactInput) => {
    setServerStatus(null);
    try {
      const result = await submitContactAction(data);
      if (result.success) {
        setServerStatus({
          success: true,
          message: result.message || "Your message has been sent successfully!",
        });
        reset();
      } else {
        setServerStatus({
          success: false,
          message: result.error || "Failed to submit message. Please try again.",
        });
      }
    } catch {
      setServerStatus({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  };

  return (
    <section id="contact" className="py-24 relative border-t border-[#303030]/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <SlideUp>
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#303030] text-xs font-mono text-[#84CC16] uppercase tracking-wider mb-3">
              <span>05. Get In Touch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Let&apos;s Build Together
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A3A3A3] max-w-xl">
              Have a project idea, question, or opportunity? Leave a message below.
            </p>
            <div className="w-16 h-1 bg-[#84CC16] rounded-full mt-4" />
          </div>
        </SlideUp>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details / Direct Info */}
          <div className="lg:col-span-5 space-y-6">
            <SlideUp delay={0.1}>
              <div className="bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl font-bold text-white mb-3">
                  Direct Inquiries
                </h3>
                <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed mb-6">
                  Feel free to send a message directly to {name}. All submissions are stored in PostgreSQL and monitored daily.
                </p>

                <div className="space-y-4">
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="group flex items-center gap-3.5 p-3.5 rounded-xl bg-[#111111] border border-[#303030] hover:border-[#84CC16] transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#303030] group-hover:border-[#84CC16] flex items-center justify-center text-[#84CC16] shrink-0 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-[11px] font-mono text-[#A3A3A3] uppercase">Email</span>
                        <p className="text-sm font-semibold text-white group-hover:text-[#84CC16] transition-colors truncate">
                          {email}
                        </p>
                      </div>
                    </a>
                  )}

                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="group flex items-center gap-3.5 p-3.5 rounded-xl bg-[#111111] border border-[#303030] hover:border-[#84CC16] transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#303030] group-hover:border-[#84CC16] flex items-center justify-center text-[#84CC16] shrink-0 transition-colors">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-[11px] font-mono text-[#A3A3A3] uppercase">Phone / WhatsApp</span>
                        <p className="text-sm font-semibold text-white group-hover:text-[#84CC16] transition-colors truncate">
                          {phone}
                        </p>
                      </div>
                    </a>
                  )}

                  <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#111111] border border-[#303030]">
                    <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#303030] flex items-center justify-center text-[#84CC16] shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-[#A3A3A3] uppercase">Location</span>
                      <p className="text-sm font-semibold text-white">
                        Satkhira / Dhaka, Bangladesh
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#111111] border border-[#303030]">
                    <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#303030] flex items-center justify-center text-[#84CC16] shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-[#A3A3A3] uppercase">Response Time</span>
                      <p className="text-sm font-semibold text-white">
                        Usually within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SlideUp>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <SlideUp delay={0.2}>
              <div className="bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 sm:p-8 relative">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase font-mono">
                      Your Name <span className="text-[#84CC16]">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="e.g. John Doe"
                      {...register("name")}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 rounded-xl bg-[#111111] border text-white text-sm placeholder-[#555] transition-colors focus:outline-none ${
                        errors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-[#303030] focus:border-[#84CC16]"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase font-mono">
                      Your Email <span className="text-[#84CC16]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="e.g. john@example.com"
                      {...register("email")}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 rounded-xl bg-[#111111] border text-white text-sm placeholder-[#555] transition-colors focus:outline-none ${
                        errors.email
                          ? "border-red-500 focus:border-red-500"
                          : "border-[#303030] focus:border-[#84CC16]"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Subject Input */}
                  <div>
                    <label htmlFor="subject" className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase font-mono">
                      Subject <span className="text-[#84CC16]">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="e.g. Collaboration Opportunity / Project Inquiry"
                      {...register("subject")}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 rounded-xl bg-[#111111] border text-white text-sm placeholder-[#555] transition-colors focus:outline-none ${
                        errors.subject
                          ? "border-red-500 focus:border-red-500"
                          : "border-[#303030] focus:border-[#84CC16]"
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-400 mt-1">{errors.subject.message}</p>
                    )}
                  </div>

                  {/* Message Input */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-[#A3A3A3] mb-1.5 uppercase font-mono">
                      Message <span className="text-[#84CC16]">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Write your message here..."
                      {...register("message")}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 rounded-xl bg-[#111111] border text-white text-sm placeholder-[#555] transition-colors focus:outline-none resize-none ${
                        errors.message
                          ? "border-red-500 focus:border-red-500"
                          : "border-[#303030] focus:border-[#84CC16]"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Server Feedback Alert */}
                  <AnimatePresence>
                    {serverStatus && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3 border ${
                          serverStatus.success
                            ? "bg-[#84CC16]/10 border-[#84CC16]/40 text-[#84CC16]"
                            : "bg-red-950/30 border-red-800/60 text-red-300"
                        }`}
                      >
                        {serverStatus.success ? (
                          <CheckCircle2 className="w-5 h-5 shrink-0 text-[#84CC16]" />
                        ) : (
                          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                        )}
                        <span>{serverStatus.message}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#84CC16] text-[#111111] font-bold text-sm hover:bg-[#65A30D] transition-all duration-200 shadow-sm hover:shadow-[0_0_20px_rgba(132,204,22,0.35)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </SlideUp>
          </div>
        </div>
      </div>
    </section>
  );
}
