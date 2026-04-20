"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Gauge } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";

export function PersonaFingerprint() {
  const { user } = useUser();
  const stats = useQuery(
    api.personas.getUserStats,
    user?.id ? { userId: user.id } : "skip"
  );

  const scrollDepth = stats?.avgScrollDepth || 0;
  const dwellTime = Math.min((stats?.avgDwellMs || 0) / 30000 * 100, 100);
  const idleCount = Math.min((stats?.idleEvents || 0) / 10 * 100, 100);

  const bars = [
    { label: "Scroll Depth", value: scrollDepth, color: "#30d158" },
    { label: "Deep Dwell", value: dwellTime, color: "#0071e3" },
    { label: "Idle Checks", value: idleCount, color: "#ff9f0a" }
  ];

  return (
    <AppCard className="col-span-12 md:col-span-3 flex flex-col justify-between h-40">
      <div className="flex items-center gap-2 mb-4">
        <Gauge size={14} className="text-[#0071e3]" />
        <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Fingerprint</h3>
      </div>
      
      <div className="flex flex-col gap-3 mt-auto">
        {bars.map((bar, i) => (
          <div key={bar.label}>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-[var(--text-tertiary)] font-bold uppercase tracking-tighter text-[9px]">{bar.label}</span>
              <span style={{ color: bar.color }} className="font-bold">{Math.round(bar.value)}%</span>
            </div>
            <div className="h-1 bg-[rgba(255,255,255,0.03)] rounded-full overflow-hidden border border-white/[0.03]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${bar.value}%` }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="h-full rounded-full"
                style={{ backgroundColor: bar.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </AppCard>
  );
}
