"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

export function SectionAffinityBars() {
  const { user } = useUser();
  const userId = user?.id || "skip";
  
  const affinity = useQuery(api.personas.getSectionAffinity, userId !== "skip" ? { userId } : "skip");

  const maxSeconds = affinity && affinity.length > 0 
    ? Math.max(...affinity.map(a => a.dwellSeconds), 1) 
    : 1;

  const labels: Record<string, string> = {
    stats: "Metrics",
    activity: "Visuals",
    oracle: "Oracle",
    notifications: "Signals"
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/10 rounded-2xl border border-zinc-800/30 p-5">
      <div className="flex items-center gap-2 mb-6">
        <Target size={14} className="text-[#0071e3]" />
        <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Time Distribution</h3>
      </div>

      <div className="flex-1 flex flex-col gap-6 justify-center">
        {affinity && affinity.length > 0 ? (
          affinity.map((item, i) => {
            const pct = Math.round((item.dwellSeconds / maxSeconds) * 100);
            return (
              <div key={item.section} className="group">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[12px] font-bold text-zinc-300 group-hover:text-white transition-colors capitalize">
                    {labels[item.section] || item.section}
                  </span>
                  <span className="text-[10px] font-black text-zinc-500">
                    {item.dwellSeconds}s
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full rounded-full ${
                      i === 0 ? "bg-[#0071e3]" : "bg-zinc-700/50"
                    }`}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex-1 flex items-center justify-center text-[11px] text-zinc-600 italic">
            Analyzing interaction surface...
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-zinc-800/50">
        <p className="text-[10px] text-zinc-600 leading-relaxed font-medium">
          Dwell time weights the interface prioritization algorithm for your current session.
        </p>
      </div>
    </div>
  );
}
