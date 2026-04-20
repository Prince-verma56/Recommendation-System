"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Target, BarChart2, TrendingUp, Sparkles, Clock, ListOrdered } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";

const SECTION_ICONS: Record<string, React.ReactNode> = {
  stats:         <BarChart2 size={13} />,
  activity:      <TrendingUp size={13} />,
  oracle:        <Sparkles size={13} />,
  notifications: <Clock size={13} />,
};

const SECTION_LABELS: Record<string, string> = {
  stats: "Your Metrics",
  activity: "Activity Chart",
  oracle: "AI Oracle",
  notifications: "Notifications",
};

export function PriorityOrderCard() {
  const { user } = useUser();
  const userId = user?.id || "skip";
  const ranked = useQuery(api.personas.getRankedSectionsByScore, userId !== "skip" ? { userId } : "skip");

  const top3 = (ranked ?? []).slice(0, 3);

  return (
    <AppCard className="col-span-12 md:col-span-6 lg:col-span-3 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <ListOrdered size={14} className="text-[#0071e3]" />
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Interface Priority</h3>
      </div>

      <div className="flex-1 flex flex-col gap-2.5">
        {top3.length > 0 ? (
          top3.map((id, i) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                i === 0 
                  ? "bg-[#0071e3]/10 border-[#0071e3]/20 text-white" 
                  : "bg-zinc-800/10 border-zinc-700/30 text-zinc-400"
              }`}
            >
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black ${
                i === 0 ? "bg-[#0071e3] text-white" : "bg-zinc-800 text-zinc-500"
              }`}>
                {i + 1}
              </div>
              <div className={i === 0 ? "text-[#0071e3]" : "text-zinc-600"}>
                {SECTION_ICONS[id] || <Target size={13} />}
              </div>
              <span className="text-[12px] font-bold tracking-tight">
                {SECTION_LABELS[id] || id}
              </span>
              {i === 0 && (
                 <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#0071e3] shadow-[0_0_8px_#0071e3]" />
              )}
            </motion.div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-[11px] text-zinc-600 italic text-center p-4">
            Awaiting behavioral signals to rank elements...
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-700/30">
        <p className="text-[9px] text-zinc-500 font-medium leading-relaxed">
          Dynamic reordering active based on engagement score.
        </p>
      </div>
    </AppCard>
  );
}
