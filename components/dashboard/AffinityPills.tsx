"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Target, Brain, BarChart2, TrendingUp, Sparkles, Clock } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";

const SECTION_ICONS: Record<string, React.ReactNode> = {
  stats:         <BarChart2 size={12} />,
  activity:      <TrendingUp size={12} />,
  oracle:        <Sparkles size={12} />,
  notifications: <Clock size={12} />,
};

const SECTION_LABELS: Record<string, string> = {
  stats: "Metrics",
  activity: "Visuals",
  oracle: "Oracle",
  notifications: "Signals",
};

export function AffinityPills() {
  const { user } = useUser();
  const userId = user?.id || "skip";
  
  const ranked = useQuery(api.personas.getRankedSectionsByScore, userId !== "skip" ? { userId } : "skip");
  const topSections = (ranked ?? []).slice(0, 4);

  return (
    <AppCard className="col-span-12 md:col-span-6 lg:col-span-4 flex flex-col h-full min-h-[140px]">
      <div className="flex items-center gap-2 mb-5">
        <Target size={14} className="text-[#0071e3]" />
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Interface Affinity</h3>
      </div>
      
      <div className="flex flex-wrap gap-2.5">
        {topSections.length > 0 ? (
          topSections.map((section, i) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`px-3.5 py-2 rounded-xl border flex items-center gap-2.5 transition-all hover:translate-y-[-2px] ${
                i === 0 
                  ? "bg-[#0071e3]/10 border-[#0071e3]/30 text-white shadow-[0_4px_15px_rgba(0,113,227,0.15)]" 
                  : "bg-zinc-800/40 border-zinc-700/30 text-zinc-400"
              }`}
            >
              <div className={i === 0 ? "text-[#0071e3]" : "text-zinc-600"}>
                {SECTION_ICONS[section] || <Target size={12} />}
              </div>
              <span className="text-[11px] font-black uppercase tracking-tight">
                {SECTION_LABELS[section] || section}
              </span>
            </motion.div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-[11px] text-zinc-600 italic">
            Calibrating behavioral vector...
          </div>
        )}
      </div>
      
      <div className="mt-auto pt-5 flex items-center justify-between opacity-50">
         <div className="flex items-center gap-1.5">
           <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">Vector Matrix</span>
           <div className="w-1 h-1 rounded-full bg-zinc-700" />
           <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">BETA</span>
         </div>
         <Brain size={12} className="text-zinc-600" />
      </div>
    </AppCard>
  );
}
