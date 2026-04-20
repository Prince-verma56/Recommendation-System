"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { AppCard } from "@/components/ui/AppCard";
import { ArrowDownUp } from "lucide-react";

export function AdaptationsLog() {
  const { user } = useUser();
  const recent = useQuery(
    api.personas.getRecentEvents,
    user?.id ? { userId: user.id, limit: 20 } : "skip"
  );
  
  // We mock the schema "RecentAdaptations" from recent events where actions change
  const logs = recent 
    ? recent.filter((e, idx, arr) => idx < arr.length - 1 && e.section !== arr[idx+1].section).slice(0, 4)
    : [];

  return (
    <AppCard className="col-span-12 md:col-span-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <ArrowDownUp size={14} className="text-[#0071e3]" />
        <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Logic Shift History</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {logs.length > 0 ? logs.map((log, i) => (
          <div key={i} className="flex justify-between items-start text-[11px] p-2.5 bg-zinc-800/20 border border-zinc-700/20 rounded-xl">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold capitalize">{log.section}</span>
                <span className="text-[9px] text-[#0071e3] font-black italic">PROMOTED</span>
              </div>
              <span className="text-zinc-500 text-[10px]">Over priority queue</span>
            </div>
            <span className="text-zinc-600 text-[10px] font-bold">
              {new Date(log.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )) : (
          <div className="text-[11px] text-zinc-500 italic mt-2">Observing structural ripples...</div>
        )}
      </div>
    </AppCard>
  );
}

