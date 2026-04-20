"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { AppCard } from "@/components/ui/AppCard";
import { 
  User, 
  Activity, 
  Zap, 
  Target, 
  Brain, 
  Database 
} from "lucide-react";
import { toast } from "sonner";

export function BehaviorPanel() {
  const { user } = useUser();
  const userId = user?.id || "skip";

  const persona = useQuery(api.personas.getPersona, userId !== "skip" ? { userId } : "skip");
  const stats = useQuery(api.personas.getUserStats, userId !== "skip" ? { userId } : "skip");
  const scored = useQuery(api.personas.getRankedSectionsByScore, userId !== "skip" ? { userId } : "skip");
  const seedDemoData = useMutation(api.seed.seedDemoData);
  const resetUserData = useMutation(api.seed.resetUserData);

  const [isResetting, setIsResetting] = useState(false);

  const activePersona = persona?.override || persona?.type || "Explorer";
  const confidence = stats?.totalEvents ? Math.min(99, Math.round(40 + stats.totalEvents * 0.8)) : 0;
  
  const handleReset = async () => {
    if (userId === "skip" || isResetting) return;
    setIsResetting(true);
    const toastId = toast.loading("Clearing historical telemetry...");
    try {
      await resetUserData({ userId });
      toast.loading("Injecting behavioral test data...", { id: toastId });
      await seedDemoData({ userId });
      toast.success("Demo Data Seeded", { id: toastId, description: "Interface is now ready to adapt." });
    } catch (e) {
      toast.error("Demonstration Reset Failed", { id: toastId });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AppCard className="flex flex-col w-full">
      {/* ── Header ───────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#0071e3]/10 flex items-center justify-center border border-[#0071e3]/20 shadow-[0_0_15px_rgba(0,113,227,0.15)]">
          <Brain size={20} className="text-[#0071e3]" />
        </div>
        <div>
          <h2 className="text-base font-bold tracking-tight text-white">Live Intelligence</h2>
          <p className="text-[10px] text-[#0071e3] font-black uppercase tracking-[0.1em]">Neural Tracking Engine</p>
        </div>
      </div>

      {/* ── Metrics Grid ──────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Classification */}
        <div className="p-4 rounded-2xl bg-zinc-800/20 border border-zinc-700/30 flex flex-col justify-between min-h-[110px] transition-all hover:bg-zinc-800/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5"><User size={12} className="text-[#0071e3]"/> Profile</span>
            <div className="px-2 py-0.5 rounded-full bg-[#30d158]/10 text-[9px] font-black text-[#30d158] border border-[#30d158]/20">
              {confidence}% Match
            </div>
          </div>
          <div className="text-xl font-black capitalize text-white tracking-tight">
            {activePersona}
          </div>
        </div>

        {/* User Signals */}
        <div className="p-4 rounded-2xl bg-zinc-800/20 border border-zinc-700/30 flex flex-col justify-between min-h-[110px] transition-all hover:bg-zinc-800/40">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 mb-3"><Activity size={12} className="text-[#0071e3]"/> Telemetry</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{stats?.totalEvents ?? 0}</span>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Signals</span>
          </div>
        </div>

        {/* Peak Affinity */}
        <div className="p-4 rounded-2xl bg-zinc-800/20 border border-zinc-700/30 flex flex-col justify-between min-h-[110px] transition-all hover:bg-zinc-800/40">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 mb-3"><Target size={12} className="text-[#0071e3]"/> Peak Affinity</span>
          <div className="text-lg font-black capitalize text-white tracking-tight">
            {scored && scored[0] ? scored[0].replace(/_/g, " ") : "Learning..."}
          </div>
        </div>

        {/* Interaction Vectors */}
        <div className="p-4 rounded-2xl bg-zinc-800/20 border border-zinc-700/30 flex flex-col justify-between min-h-[110px] transition-all hover:bg-zinc-800/40">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 mb-3"><Zap size={12} className="text-[#0071e3]"/> Interaction</span>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-500 font-bold uppercase tracking-tighter text-[9px]">Dwell</span>
              <span className="text-white font-black">{stats ? Math.round(stats.avgDwellMs / 1000) : 0}s</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-500 font-bold uppercase tracking-tighter text-[9px]">Scroll</span>
              <span className="text-white font-black">{stats ? Math.round(stats.avgScrollDepth) : 0}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Control Bar ────────────────── */}
      <div className="mt-8 pt-5 border-t border-zinc-700/30 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
                {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[8px] font-black">{i}</div>)}
            </div>
            <p className="text-[10px] text-zinc-500 font-medium max-w-[280px] leading-relaxed">
              Neural state can be fully reset to observe the "Explorer" mode adaptation flow from zero.
            </p>
        </div>
        <button 
          onClick={handleReset}
          disabled={isResetting}
          className="px-6 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 transition-all hover:bg-[#ff453a]/10 hover:border-[#ff453a]/30 hover:text-[#ff453a] disabled:opacity-30 active:scale-95 whitespace-nowrap"
        >
          <Database size={13} />
          {isResetting ? "Synchronizing..." : "Clear Neural State"}
        </button>
      </div>
    </AppCard>
  );
}
