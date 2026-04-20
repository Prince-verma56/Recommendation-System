"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { AppCard } from "@/components/ui/AppCard";

export function WeeklyChart() {
  const { user } = useUser();
  const userId = user?.id || "skip";
  const weeklyData = useQuery(api.personas.getWeeklyEngagement, userId !== "skip" ? { userId } : "skip");

  const data = weeklyData || [
    { name: "Mon", count: 0 }, { name: "Tue", count: 0 }, { name: "Wed", count: 0 },
    { name: "Thu", count: 0 }, { name: "Fri", count: 0 }, { name: "Sat", count: 0 }, { name: "Sun", count: 0 },
  ];

  const isEmpty = !weeklyData || weeklyData.every(d => d.count === 0);

  return (
    <AppCard className="col-span-12 lg:col-span-8 flex flex-col h-40">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-[#0071e3]" />
          <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Weekly engagement</h3>
        </div>
        <div className="flex items-center gap-1.5">
           <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">7d Trend</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[100px] relative">
        {isEmpty && (
           <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 z-10">
              <TrendingUp size={16} className="text-zinc-600 mb-1" />
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">Waiting for data...</span>
           </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <Tooltip 
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{ backgroundColor: "#0a0a0a", border: "0.5px solid #333", borderRadius: "8px", fontSize: "10px" }}
              itemStyle={{ color: "#0071e3", fontWeight: 700 }}
            />
            <Bar 
              dataKey="count" 
              fill="#0071e3" 
              radius={[2, 2, 0, 0]} 
              opacity={isEmpty ? 0.05 : 1}
              barSize={20}
            />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 9, fill: "#555", fontWeight: 700 }}
              dy={5}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AppCard>
  );
}
