"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { AppCard } from "@/components/ui/AppCard";
import { 
  User, 
  Compass, 
  Zap, 
  Activity, 
  Clock, 
  MousePointer2,
  Calendar,
  Sparkles
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function BehavioralProfileCard() {
  const { user } = useUser();
  const userId = user?.id || "skip";
  const profileData = useQuery(api.personas.getUserProfileStats, userId !== "skip" ? { userId } : "skip");

  if (!profileData) {
    return (
      <AppCard className="h-full min-h-[300px] flex flex-col items-center justify-center space-y-4">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 rounded-full bg-zinc-800"
        />
        <div className="space-y-2">
          <div className="w-32 h-3 bg-zinc-800 rounded animate-pulse" />
          <div className="w-24 h-2 bg-zinc-800/50 rounded animate-pulse mx-auto" />
        </div>
      </AppCard>
    );
  }

  const { persona, stats, confidence } = profileData;
  const activePersona = persona?.type || "Explorer";

  const PERSONA_CONFIG = {
    "Explorer": { icon: <Compass size={24} />, color: "#30d158", desc: "Balanced, discovery-driven pattern" },
    "Power User": { icon: <Zap size={24} />, color: "#bf5af2", desc: "Dense, analytical deep-focus" },
    "Quick Scanner": { icon: <MousePointer2 size={24} />, color: "#ff9f0a", desc: "Rapid, KPI-focused browsing" },
  };

  const config = PERSONA_CONFIG[activePersona as keyof typeof PERSONA_CONFIG] || PERSONA_CONFIG["Explorer"];

  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  }) : "Recent";

  return (
    <AppCard className="h-full flex flex-col relative overflow-hidden group">
      {/* Dynamic Background Glow */}
      <div 
        className="absolute -top-24 -left-24 w-64 h-64 blur-[100px] opacity-10 transition-colors duration-1000"
        style={{ backgroundColor: config.color }}
      />

      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center relative shadow-lg">
             <div className="relative z-10" style={{ color: config.color }}>{config.icon}</div>
             <motion.div 
               animate={{ opacity: [0.1, 0.3, 0.1] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute inset-0 blur-md rounded-2xl"
               style={{ backgroundColor: config.color }}
             />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-white">{activePersona}</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mt-1">{config.desc}</p>
          </div>
        </div>

        {/* Confidence Ring */}
        <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
                <circle 
                  cx="28" cy="28" r="24" 
                  fill="none" stroke="currentColor" strokeWidth="3" 
                  className="text-zinc-800/50"
                />
                <motion.circle 
                  cx="28" cy="28" r="24" 
                  fill="none" stroke={config.color} strokeWidth="3" 
                  strokeDasharray={150}
                  initial={{ strokeDashoffset: 150 }}
                  animate={{ strokeDashoffset: 150 - (150 * confidence) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-black text-white">{confidence}%</span>
                <span className="text-[6px] font-bold text-zinc-500 uppercase">Sync</span>
            </div>
        </div>
      </div>

      {/* Metrics Matrix */}
      <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
           <div className="flex items-center gap-2 text-zinc-500 mb-1">
             <Activity size={12} className="text-[#0071e3]" />
             <span className="text-[9px] font-black uppercase tracking-wider">Total Signals</span>
           </div>
           <div className="text-lg font-black text-white">{stats?.totalEvents ?? 0}</div>
        </div>
        
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
           <div className="flex items-center gap-2 text-zinc-500 mb-1">
             <Sparkles size={12} className="text-[#30d158]" />
             <span className="text-[9px] font-black uppercase tracking-wider">Adaptations</span>
           </div>
           <div className="text-lg font-black text-white">{stats?.adaptations ?? 0}</div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
           <div className="flex items-center gap-2 text-zinc-500 mb-1">
             <Clock size={12} className="text-[#ff9f0a]" />
             <span className="text-[9px] font-black uppercase tracking-wider">Avg Dwell</span>
           </div>
           <div className="text-lg font-black text-white">{Math.round((stats?.avgDwellMs ?? 0) / 1000)}s</div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
           <div className="flex items-center gap-2 text-zinc-500 mb-1">
             <MousePointer2 size={12} className="text-[#bf5af2]" />
             <span className="text-[9px] font-black uppercase tracking-wider">Scroll Int.</span>
           </div>
           <div className="text-lg font-black text-white">{stats?.avgScrollDepth ?? 0}%</div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-6 border-t border-zinc-800/30 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 text-zinc-500">
           <Calendar size={13} />
           <span className="text-[10px] font-bold">Node online since {memberSince}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-black text-[#0071e3] uppercase tracking-widest px-2 py-0.5 bg-[#0071e3]/10 border border-[#0071e3]/20 rounded-md">
           <div className="w-1 h-1 rounded-full bg-[#0071e3] animate-pulse" />
           Live Intelligence
        </div>
      </div>
    </AppCard>
  );
}
