"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

export function EngagementLineChart() {
  const { user } = useUser();
  const weekly = useQuery(
    api.personas.getWeeklyEngagement,
    user?.id ? { userId: user.id } : "skip"
  );

  const data = weekly ?? [];

  return (
    <div className="bento-card col-span-12 lg:col-span-6 flex flex-col p-5" style={{ minHeight: "220px" }}>
      <h3 className="text-sm font-semibold tracking-tight mb-4">Engagement Trend</h3>
      <div className="flex-1 w-full min-h-[140px]">
        {data.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--text-tertiary)" }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0a0a0a", border: "0.5px solid #333", borderRadius: "8px", fontSize: "11px" }}
                  itemStyle={{ color: "#0071e3", fontWeight: 600 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#0071e3" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#0071e3", strokeWidth: 2, stroke: "#000" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        ) : (
          <div className="h-full w-full flex items-center justify-center animate-pulse">
            <div className="w-full h-0.5 bg-[rgba(var(--fg-rgb),0.05)]" />
          </div>
        )}
      </div>
    </div>
  );
}
