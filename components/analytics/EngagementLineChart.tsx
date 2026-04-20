"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export function EngagementLineChart() {
  const { user } = useUser();
  const userId = user?.id || "skip";
  const weekly = useQuery(
    api.personas.getWeeklyEngagement,
    userId !== "skip" ? { userId } : "skip"
  );

  const data = weekly ?? [];
  const isEmpty = !weekly || weekly.length === 0 || weekly.every(d => d.count === 0);

  return (
    <div className="bento-card col-span-12 lg:col-span-6 flex flex-col p-6 h-64">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Engagement Trend</h3>
        {!isEmpty && (
          <span className="text-[9px] text-[#0071e3] font-bold">7-DAY VOLUME</span>
        )}
      </div>

      <div className="flex-1 w-full relative">
        {isEmpty ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">No activity this week</p>
            <p className="text-[10px] text-zinc-700 mt-1">Engagement metrics pending sync.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)", fontWeight: 700 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)", fontWeight: 700 }}
                />
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
                />
                <Bar 
                  dataKey="count" 
                  fill="#0071e3" 
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
}
