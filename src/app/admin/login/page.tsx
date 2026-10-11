"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations";
import { loginAction } from "@/server/actions/auth";
import { Shield, Lock, Mail, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setErrorMessage(null);
    try {
      const result = await loginAction(data);
      if (result.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setErrorMessage(result.error || "Invalid email or password.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center p-4 relative">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#84CC16]/5 blur-[120px] rounded-full" />
      </div>

      {/* Back to Public Site */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#A3A3A3] hover:text-[#84CC16] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Portfolio</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#1A1A1A] border border-[#303030] rounded-2xl p-7 sm:p-9 shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#111111] border border-[#84CC16] flex items-center justify-center text-[#84CC16] mx-auto mb-4 shadow-[0_0_20px_rgba(132,204,22,0.2)]">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Admin Portal
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-1.5 font-mono">
            Secure management console for Md. Ratul Hasan
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1.5 uppercase">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#737373]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                placeholder="admin@ratulhasan.dev"
                {...register("email")}
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border text-white text-sm placeholder-[#555] transition-colors focus:outline-none ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#303030] focus:border-[#84CC16]"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-[#A3A3A3] mb-1.5 uppercase">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#737373]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                placeholder="••••••••••••"
                {...register("password")}
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111111] border text-white text-sm placeholder-[#555] transition-colors focus:outline-none ${
                  errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#303030] focus:border-[#84CC16]"
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#84CC16] text-[#111111] font-bold text-sm hover:bg-[#65A30D] transition-all duration-200 shadow-sm hover:shadow-[0_0_20px_rgba(132,204,22,0.35)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#303030]/60 text-center text-[11px] text-[#737373] font-mono">
          <span>Protected by server-side JWT session cookies & rate limits.</span>
        </div>
      </motion.div>
    </div>
  );
}
