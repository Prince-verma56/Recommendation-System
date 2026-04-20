"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Plus } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { AppCard } from "@/components/ui/AppCard";

export function WeeklyChart() {
  const { user } = useUser();
  const userId = user?.id || "skip";
  const weeklyData = useQuery(api.personas.getWeeklyEngagement, userId !== "skip" ? { userId } : "skip");

  // Fallback data for layout preview
  const data = (weeklyData && weeklyData.length > 0) ? weeklyData : [
    { day: "Mon", count: 0 }, { day: "Tue", count: 0 }, { day: "Wed", count: 0 },
    { day: "Thu", count: 0 }, { day: "Fri", count: 0 }, { day: "Sat", count: 0 }, { day: "Sun", count: 0 },
  ];

  const isEmpty = !weeklyData || weeklyData.every(d => d.count === 0);

  return (
    <AppCard className="col-span-12 lg:col-span-8 flex flex-col h-full min-h-[300px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0071e3]/10 flex items-center justify-center">
            <TrendingUp size={16} className="text-[#0071e3]" />
          </div>
          <div>
            <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Weekly engagement</h3>
            <p className="text-[9px] text-zinc-600 font-medium">Activity volume over 7 days</p>
          </div>
        </div>
        {!isEmpty && (
           <div className="px-2.5 py-1 rounded-md bg-zinc-800/50 border border-zinc-700/30 text-[9px] font-black text-[#2997ff] tracking-tighter uppercase">
             Live Sync
           </div>
        )}
      </div>

      <div className="flex-1 w-full relative">
        {isEmpty && (
           <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3 text-zinc-700">
                <Plus size={20} strokeWidth={3} />
              </div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">No activity this week</span>
              <p className="text-[9px] text-zinc-700 mt-1">Telemetry will appear here as you interact.</p>
           </div>
        )}
        
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Tooltip 
              cursor={{ fill: "rgba(0,113,227,0.03)" }}
              contentStyle={{ 
                backgroundColor: "rgba(10,10,15,0.95)", 
                border: "1.5px solid rgba(255,255,255,0.05)", 
                borderRadius: "12px", 
                fontSize: "11px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                backdropFilter: "blur(12px)"
              }}
              itemStyle={{ color: "#0071e3", fontWeight: 800 }}
              labelStyle={{ color: "rgba(255,255,255,0.4)", marginBottom: "4px", fontSize: "10px", fontWeight: 600, textTransform: "uppercase" }}
            />
            <Bar 
              dataKey="count" 
              fill="#0071e3" 
              radius={[4, 4, 0, 0]} 
              opacity={isEmpty ? 0.05 : 1}
              barSize={32}
            />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)", fontWeight: 700 }}
              dy={10}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AppCard>
  );
}
