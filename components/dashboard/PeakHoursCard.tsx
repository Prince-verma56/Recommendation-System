"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Clock, TrendingUp } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";

export function PeakHoursCard() {
  const { user } = useUser();
  const userId = user?.id || "skip";
  const peaks = useQuery(api.personas.getPeakHours, userId !== "skip" ? { userId } : "skip");

  return (
    <AppCard className="col-span-12 md:col-span-6 lg:col-span-3 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={14} className="text-[#0071e3]" />
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Peak Activity</h3>
      </div>

      <div className="flex-1 flex flex-col gap-5 justify-center">
        {peaks && peaks.length > 0 ? (
          peaks.map((peak, i) => (
            <div key={peak.label}>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-[14px] font-bold text-white tracking-tight">{peak.label}</span>
                <span className="text-[10px] font-black text-[#0071e3] tracking-tighter">{peak.pct}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800/40 rounded-full overflow-hidden border border-zinc-700/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${peak.pct}%` }}
                  transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#0071e3] to-[#2997ff] rounded-full"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center space-y-2">
            <TrendingUp size={24} className="text-zinc-600" />
            <p className="text-[10px] font-bold uppercase tracking-tighter">Profiling Rhythms...</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-700/30 flex items-center justify-between">
        <span className="text-[9px] font-bold text-zinc-600 uppercase">Focus Density</span>
        <div className="flex gap-1">
           {[...Array(3)].map((_, i) => (
             <div key={i} className={`w-1 h-3 rounded-full ${i === 2 ? "bg-zinc-800" : "bg-[#0071e3]/40"}`} />
           ))}
        </div>
      </div>
    </AppCard>
  );
}
