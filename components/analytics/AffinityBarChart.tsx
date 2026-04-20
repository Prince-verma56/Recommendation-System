"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";

export function AffinityBarChart() {
  const { user } = useUser();
  const events = useQuery(
    api.personas.getRecentEvents,
    user?.id ? { userId: user.id, limit: 100 } : "skip"
  );

  // Group dwell by section
  const reduced = (events || []).reduce((acc: any, curr: any) => {
    if (curr.dwellMs) {
      acc[curr.section] = (acc[curr.section] || 0) + curr.dwellMs;
    }
    return acc;
  }, {});

  const data = Object.keys(reduced).map(key => ({
    section: key.charAt(0).toUpperCase() + key.slice(1),
    dwellSeconds: Math.round(reduced[key] / 1000)
  })).sort((a, b) => b.dwellSeconds - a.dwellSeconds);

  return (
    <div className="bento-card col-span-12 p-5 flex flex-col" style={{ minHeight: "240px" }}>
      <h3 className="text-sm font-semibold tracking-tight mb-4">Section Affinity Distribution</h3>
      <div className="flex-1 w-full min-h-[160px]">
        {data.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="section" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: "var(--text-secondary)", fontWeight: 500 }}
                  width={90}
                />
                <Tooltip 
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  contentStyle={{ backgroundColor: "#0a0a0a", border: "0.5px solid #333", borderRadius: "8px", fontSize: "11px" }}
                  formatter={(value) => [`${value}s total dwell`, "Affinity"]}
                />
                <Bar dataKey="dwellSeconds" barSize={12} radius={[0, 4, 4, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#bf5af2" : "rgba(191,90,242,0.4)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        ) : (
          <div className="text-[11px] text-[var(--text-tertiary)] w-full h-full flex items-center justify-center">
            Insufficient dwell data to generate affinity maps.
          </div>
        )}
      </div>
    </div>
  );
}
