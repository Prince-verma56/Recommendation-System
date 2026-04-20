"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { AppCard } from "@/components/ui/AppCard";
import { motion } from "framer-motion";
import { Activity, Signal, Zap, MousePointerClick, Target } from "lucide-react";

export function SignalsBlock() {
  const { user } = useUser();
  const id = user?.id || "skip";

  const stats = useQuery(api.personas.getUserStats, id !== "skip" ? { userId: id } : "skip");

  const confidence = stats?.totalEvents
    ? Math.min(99, Math.round(40 + stats.totalEvents * 0.8))
    : 0;

  return (
    <AppCard className="col-span-12 md:col-span-4 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-[#0071e3]" />
          <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Live Signals</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#0071e3]/10 border border-[#0071e3]/20 rounded-full">
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1 h-1 bg-[#0071e3] rounded-full" />
          <span className="text-[8px] font-bold text-[#0071e3] tracking-tighter">LIVE</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
          <span className="text-[11px] text-[var(--text-secondary)] flex items-center gap-2"><Activity size={12} className="text-zinc-500" /> Total Events</span>
          <span className="text-[13px] font-bold text-white">{stats?.totalEvents || 0}</span>
        </div>
        <div className="flex justify-between items-center border-b border-white/[0.04] pb-2">
          <span className="text-[11px] text-[var(--text-secondary)] flex items-center gap-2"><MousePointerClick size={12} className="text-zinc-500" /> Interaction Count</span>
          <span className="text-[13px] font-bold text-white">{stats?.clickEvents || 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-[var(--text-secondary)] flex items-center gap-2"><Target size={12} className="text-zinc-500" /> Model Confidence</span>
          <span className="text-[13px] font-bold text-[#0071e3]">{confidence}%</span>
        </div>
      </div>
    </AppCard>
  );
}

