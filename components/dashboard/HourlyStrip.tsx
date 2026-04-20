"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { AppCard } from "@/components/ui/AppCard";
import { Clock } from "lucide-react";

export function HourlyStrip() {
  const { user } = useUser();
  const userId = user?.id || "skip";
  
  const hourly = useQuery(
    api.personas.getTodaysHourlyActivity,
    userId !== "skip" ? { userId } : "skip"
  );

  const hourlyData = hourly ?? new Array(24).fill(0);
  const currentHour = new Date().getHours();
  const hourlyMax = Math.max(...hourlyData, 1);

  return (
    <AppCard suppressHydrationWarning className="col-span-12 flex flex-col justify-between h-40">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
           <Clock size={14} className="text-[#0071e3]" />
           <h3 className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">Today's Hourly Rhythm</h3>
        </div>
        <span className="text-[9px] bg-white/[0.04] border border-white/[0.05] px-2 py-0.5 rounded-full text-zinc-500 font-bold">
          {currentHour}:00 NOW
        </span>
      </div>
      
      <div className="flex gap-1 h-[60px] items-end pb-1">
        {hourlyData.map((v: number, i: number) => {
          const isCurrent = i === currentHour;
          const intensity = v / hourlyMax;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.01 }}
              className="flex-1 rounded-sm relative group cursor-crosshair min-w-[2px]"
              style={{
                height: `${15 + intensity * 85}%`,
                background: isCurrent
                  ? "#0071e3"
                  : `rgba(0,113,227,${0.08 + intensity * 0.6})`,
                boxShadow: isCurrent ? "0 0 8px rgba(0,113,227,0.4)" : "none",
              }}
            >
              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] py-1 px-2 rounded whitespace-nowrap z-20 pointer-events-none border border-zinc-800 font-bold">
                {i}:00 • {Math.round(v / 1000)}s
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="flex justify-between text-[8px] text-zinc-600 font-bold tracking-tighter mt-2">
        <span>12 AM</span>
        <span>6 AM</span>
        <span>12 PM</span>
        <span>6 PM</span>
        <span>11 PM</span>
      </div>
    </AppCard>
  );
}
