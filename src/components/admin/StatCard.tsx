import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  badge?: string;
}

export function StatCard({ title, value, description, icon: Icon, badge }: StatCardProps) {
  return (
    <div className="bg-[#1A1A1A] border border-[#303030] rounded-2xl p-6 relative overflow-hidden group hover:border-[#84CC16]/50 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider block mb-1">
            {title}
          </span>
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {value}
          </span>
        </div>

        <div className="w-12 h-12 rounded-xl bg-[#111111] border border-[#303030] group-hover:border-[#84CC16] flex items-center justify-center text-[#84CC16] transition-colors shadow-inner">
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-[#A3A3A3] pt-3 border-t border-[#303030]/60">
        <span>{description}</span>
        {badge && (
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#84CC16]/10 text-[#84CC16] border border-[#84CC16]/30">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
