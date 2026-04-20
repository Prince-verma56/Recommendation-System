"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Target, Brain } from "lucide-react";
import { AppCard } from "@/components/ui/AppCard";

export function AffinityPills() {
  const { user } = useUser();
  const userId = user?.id || "skip";
  
  const persona = useQuery(api.personas.getPersona, userId !== "skip" ? { userId } : "skip");
  const scored = persona?.scoredSections || [];

  return (
    <AppCard className="col-span-12 md:col-span-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Target size={14} className="text-[#0071e3]" />
        <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Interface Affinity</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {scored.length > 0 ? (
          scored.slice(0, 5).map((section, i) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="px-3 py-1.5 rounded-lg bg-zinc-800/40 border border-zinc-700/30 text-[11px] font-semibold text-white flex items-center gap-2 transition-colors hover:bg-zinc-800/60"
            >
              <div className="w-1 h-1 rounded-full bg-[#0071e3]" />
              {section.replace(/_/g, " ").toUpperCase()}
            </motion.div>
          ))
        ) : (
          <div className="text-[11px] text-zinc-500 italic">No behavioral affinity mapped yet.</div>
        )}
      </div>
      
      <div className="mt-auto pt-4 flex items-center justify-between opacity-50">
         <span className="text-[9px] font-bold text-zinc-600 uppercase">Vector Ranking</span>
         <Brain size={12} className="text-zinc-600" />
      </div>
    </AppCard>
  );
}
