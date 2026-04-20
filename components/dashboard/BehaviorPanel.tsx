"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { AppCard } from "@/components/ui/AppCard";
import { 
  User, 
  Activity, 
  Zap, 
  Target, 
  Brain, 
  Database,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { toast } from "sonner";

const SECTION_LABELS: Record<string, string> = {
  stats: "Metrics Matrix",
  activity: "Engagement Trend",
  oracle: "AI Oracle",
  notifications: "Neural Alerts",
};

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
  const peakAffinityId = scored && scored[0] ? scored[0] : null;
  const peakAffinityLabel = peakAffinityId ? (SECTION_LABELS[peakAffinityId] || peakAffinityId.replace(/_/g, " ")) : "Analyzing...";
  
  const handleReset = async () => {
    if (userId === "skip" || isResetting) return;
    setIsResetting(true);
    const toastId = toast.loading("Clearing historical telemetry...");
    try {
      await resetUserData({ userId });
      toast.loading("Relinking behavioral nodes...", { id: toastId });
      await seedDemoData({ userId });
      toast.success("Neural State Reset", { id: toastId, description: "Interface has been restored to factory 'Explorer' configuration." });
    } catch (e) {
      toast.error("Handshake Failed", { id: toastId });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AppCard className="flex flex-col w-full relative overflow-hidden group">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#0071e3]/5 blur-[80px] -mr-32 -mt-32 pointer-events-none group-hover:bg-[#0071e3]/10 transition-colors duration-700" />
      
      {/* ── Header ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center relative">
            <Brain size={24} className="text-[#0071e3] relative z-10" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-[#0071e3]/20 rounded-2xl blur-lg" 
            />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              Neural Tracking Engine
              <div className="px-2 py-0.5 rounded-md bg-[#0071e3]/10 border border-[#0071e3]/20 text-[8px] font-black text-[#2997ff] uppercase tracking-widest h-fit">v4.0.2</div>
            </h2>
            <div className="flex items-center gap-3">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.15em]">Live Intelligence Protocol</p>
              <div className="flex items-center gap-1.5 text-[9px] text-[#30d158] font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse" />
                ENCRYPTED LINK
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col items-center justify-center min-w-[80px]">
             <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Latency</span>
             <span className="text-[10px] font-bold text-white tracking-tighter">12ms</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col items-center justify-center min-w-[80px]">
             <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Uptime</span>
             <span className="text-[10px] font-bold text-[#30d158] tracking-tighter">99.9%</span>
          </div>
        </div>
      </div>

      {/* ── Metrics Grid ──────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        
        {/* Classification Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 flex flex-col justify-between min-h-[140px] relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-700/30">
               <User size={14} className="text-[#0071e3]"/>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-[#30d158]/5 text-[9px] font-black text-[#30d158] border border-[#30d158]/10 shadow-[0_0_10px_rgba(48,209,88,0.05)]">
              {confidence}% SYNC
            </div>
          </div>
          <div>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Active Persona Type</span>
            <div className="text-2xl font-black capitalize text-white tracking-tight flex items-center gap-2">
              {activePersona}
              <ShieldCheck size={16} className="text-[#0071e3]" />
            </div>
          </div>
        </motion.div>

        {/* User Signals Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 flex flex-col justify-between min-h-[140px]"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-700/30 mb-4">
             <Activity size={14} className="text-[#0071e3]"/>
          </div>
          <div>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Accumulated Signals</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{stats?.totalEvents ?? 0}</span>
              <span className="text-[10px] font-black text-[#2997ff] uppercase tracking-tighter px-1.5 py-0.5 bg-[#0071e3]/10 rounded-md">Vectors</span>
            </div>
          </div>
        </motion.div>

        {/* Peak Affinity Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 flex flex-col justify-between min-h-[140px]"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-700/30 mb-4">
             <Target size={14} className="text-[#0071e3]"/>
          </div>
          <div>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Peak Affinity Hub</span>
            <div className="text-xl font-black capitalize text-white tracking-tight flex items-center gap-2">
              {peakAffinityLabel}
              <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
            </div>
          </div>
        </motion.div>

        {/* Interaction Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 flex flex-col justify-between min-h-[140px]"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-700/30 mb-4">
             <Zap size={14} className="text-[#0071e3]"/>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px] bg-zinc-800/30 rounded-lg p-2 border border-zinc-700/10">
              <span className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Dwell Affinity</span>
              <span className="text-white font-black">{stats ? Math.round(stats.avgDwellMs / 1000) : 0}s</span>
            </div>
            <div className="flex justify-between items-center text-[11px] bg-zinc-800/30 rounded-lg p-2 border border-zinc-700/10">
              <span className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Scroll Gravity</span>
              <span className="text-white font-black">{stats ? Math.round(stats.avgScrollDepth) : 0}%</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── Control Bar ────────────────── */}
      <div className="mt-8 pt-6 border-t border-zinc-800/30 flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
                {[1, 2, 3].map(i => {
                  const isActive = (scored?.length ?? 0) >= i;
                  return (
                    <div 
                      key={i} 
                      className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-500 ${
                        isActive 
                          ? "bg-[#0071e3] border-[#0071e3] shadow-[0_0_8px_rgba(0,113,227,0.5)]" 
                          : "bg-transparent border-zinc-800"
                      }`}
                    />
                  );
                })}
            </div>
            <div className="hidden sm:block w-[1px] h-8 bg-zinc-800/50" />
            <p className="text-[11px] text-zinc-400 font-medium max-w-[340px] leading-relaxed">
              <span className="text-zinc-200 font-bold">Neural redundancy is active.</span> You can safely purge historical fingerprints to recalibrate the adaptation engine from zero.
            </p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReset}
          disabled={isResetting}
          className="group px-8 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all hover:border-[#ff453a]/40 hover:bg-[#ff453a]/5 hover:text-[#ff453a] disabled:opacity-30 whitespace-nowrap overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          <Database size={13} className="text-zinc-500 group-hover:text-[#ff453a] transition-colors" />
          {isResetting ? "CLEARING NODES..." : "CLEAR NEURAL STATE"}
        </motion.button>
      </div>
    </AppCard>
  );
}
