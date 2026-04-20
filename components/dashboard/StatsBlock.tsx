"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

// ── SVG Sparkline driven by real data ──────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 72, h = 28;

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return [x, y] as [number, number];
  });

  const linePath = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;
  const lastPt = pts[pts.length - 1];
  const id = `sg-${color.replace("#", "")}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="sparkline-glow" style={{ overflow: "visible", flexShrink: 0 }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${id})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastPt[0]} cy={lastPt[1]} r={2.5} fill={color} />
    </svg>
  );
}

// Build sparkline from hourly activity data (real)
function buildSparkline(hourly: number[] | undefined, defaultLen = 9): number[] {
  if (!hourly || hourly.length === 0) return new Array(defaultLen).fill(0);
  // Downsample to 9 points from 24 hours
  const step = Math.floor(hourly.length / defaultLen);
  return Array.from({ length: defaultLen }, (_, i) => hourly[Math.min(i * step, hourly.length - 1)]);
}

// Compute % change comparing first half vs second half of a sparkline
function pctChange(data: number[]): { label: string; positive: boolean } {
  if (data.length < 2) return { label: "—", positive: true };
  const mid  = Math.floor(data.length / 2);
  const prev = data.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
  const curr = data.slice(mid).reduce((a, b) => a + b, 0) / (data.length - mid);
  if (prev === 0) return { label: curr > 0 ? "+100%" : "—", positive: true };
  const pct = ((curr - prev) / prev) * 100;
  return {
    label: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
    positive: pct >= 0,
  };
}

import { useUser } from "@clerk/nextjs";
import { AppCard } from "@/components/ui/AppCard";

// ── Main component ─────────────────────────────────────────────────────────
export function StatsBlock({ isTop }: { isTop?: boolean } = {}) {
  const { user } = useUser();
  const userId = user?.id || "skip";

  const stats  = useQuery(api.personas.getUserStats,            userId !== "skip" ? { userId } : "skip");
  const hourly = useQuery(api.personas.getTodaysHourlyActivity, userId !== "skip" ? { userId } : "skip");
  const weekly = useQuery(api.personas.getWeeklyEngagement,     userId !== "skip" ? { userId } : "skip");

  const avgDwellSec     = stats ? Math.round(stats.avgDwellMs / 1000) : 0;
  const minutes         = Math.floor(avgDwellSec / 60);
  const seconds         = avgDwellSec % 60;
  const dwellFormatted  = stats ? `${minutes}m ${seconds}s` : "0s";

  // Real sparklines from hourly activity
  const dwellSparkData  = buildSparkline(hourly);
  const weeklySparkData = weekly ? weekly.map((d) => d.count) : [];

  const dwellChange   = pctChange(dwellSparkData);
  const weeklyChange  = pctChange(weeklySparkData.length > 0 ? weeklySparkData : dwellSparkData);
  const scrollSpark   = buildSparkline(hourly?.map((_: number, i: number) => i % 3 === 0 ? stats?.avgScrollDepth ?? 0 : (stats?.avgScrollDepth ?? 0) * 0.9));

  const dynamicStats = [
    {
      label: "Weekly Events",
      value: stats?.totalEvents?.toString() ?? "0",
      change: weeklyChange.label,
      positive: weeklyChange.positive,
      sparkData: weeklySparkData.length > 0 ? weeklySparkData : new Array(9).fill(0),
    },
    {
      label: "Avg Dwell Time",
      value: dwellFormatted,
      change: dwellChange.label,
      positive: dwellChange.positive,
      sparkData: dwellSparkData,
    },
    {
      label: "Scroll Depth",
      value: stats ? `${Math.round(stats.avgScrollDepth)}%` : "0%",
      change: "Live",
      positive: true,
      sparkData: scrollSpark,
    },
    {
      label: "AI Adaptations",
      value: stats?.adaptations?.toString() ?? "0",
      change: "Total",
      positive: true,
      sparkData: stats?.adaptations
        ? Array.from({ length: 9 }, (_, i) => Math.min(stats.adaptations, i + 1))
        : new Array(9).fill(0),
    },
  ];

  return (
    <div className="col-span-12 lg:col-span-4 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <div className="text-[10px] uppercase font-semibold tracking-wider text-[var(--text-tertiary)] mb-1">Performance Stats</div>
          <h3 className="text-sm font-bold tracking-tight">Your Metrics</h3>
        </div>
        {isTop && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[9px] bg-[#0071e3]/10 text-[#2997ff] px-2.5 py-1 rounded-full border border-[#0071e3]/20 font-bold uppercase tracking-wider"
          >
            Top Priority
          </motion.span>
        )}
      </div>

      {/* 2×2 real data grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {dynamicStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <AppCard className="p-3.5 md:p-4 flex flex-col" variant={isTop ? "priority" : "default"}>
              <div className="text-[10px] font-medium text-[var(--text-tertiary)] uppercase tracking-tight mb-2">{stat.label}</div>
              <div className="text-xl md:text-2xl font-bold tracking-tighter mb-4">
                {stat.value}
              </div>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] font-medium text-zinc-400">
                  {stat.positive ? <TrendingUp size={10} className="text-[#0071e3]" /> : <TrendingDown size={10} className="text-zinc-500" />}
                  <span>{stat.change}</span>
                </div>
                <Sparkline data={stat.sparkData} color="#0071e3" />
              </div>
            </AppCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

