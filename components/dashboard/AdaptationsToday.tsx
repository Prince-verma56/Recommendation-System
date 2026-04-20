"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { AppCard } from "@/components/ui/AppCard";
import { Sparkles } from "lucide-react";

export function AdaptationsToday() {
  const { user } = useUser();
  const userId = user?.id || "skip";
  const stats = useQuery(api.personas.getUserStats, userId !== "skip" ? { userId } : "skip");

  return (
    <AppCard className="col-span-12 md:col-span-4 lg:col-span-2 flex flex-col justify-between h-40">
      <div className="flex flex-col gap-1">
        <Sparkles size={14} className="text-[#0071e3]" />
        <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Adaptations</h3>
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="text-3xl font-bold tracking-tight text-white">
          {stats?.adaptations ?? 0}
        </div>
        <div className="text-[10px] font-bold text-[#0071e3] uppercase tracking-tighter">
          Tactical Shifts Today
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-700/30">
         <div className="flex items-center justify-between text-[9px] font-bold text-zinc-500 uppercase">
            <span>Accuracy</span>
            <span className="text-white">99.2%</span>
         </div>
      </div>
    </AppCard>
  );
}

