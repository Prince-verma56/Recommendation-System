"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 72;
  const h = 28;

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return [x, y] as [number, number];
  });

  const linePath = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;
  const lastPt = pts[pts.length - 1];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="sparkline-glow" style={{ overflow: "visible", flexShrink: 0 }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#sg-${color.replace("#", "")})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastPt[0]} cy={lastPt[1]} r={2.5} fill={color} />
    </svg>
  );
}

export function StatsBlock({ userId, isTop }: { userId: string; isTop?: boolean }) {
  const stats = useQuery(api.personas.getUserStats, { userId });

  const avgDwellSec = stats ? Math.round(stats.avgDwellMs / 1000) : 0;
  const minutes = Math.floor(avgDwellSec / 60);
  const seconds = avgDwellSec % 60;
  const dwellFormatted = `${minutes}m ${seconds}s`;

  const dynamicStats = [
    {
      label: "Weekly Views",
      value: stats?.totalEvents?.toString() ?? "—",
      change: "+14.3%",
      positive: true,
      sparkData: [30, 42, 38, 55, 47, 65, 80, 72, 90],
      color: "#0071e3",
    },
    {
      label: "Avg Dwell Time",
      value: stats ? dwellFormatted : "—",
      change: "+8.1%",
      positive: true,
      sparkData: [20, 28, 25, 35, 32, 30, 42, 38, 45],
      color: "#30d158",
    },
    {
      label: "Scroll Depth",
      value: stats ? `${stats.avgScrollDepth}%` : "—",
      change: "-3.2%",
      positive: false,
      sparkData: [75, 70, 80, 68, 72, 65, 70, 68, 64],
      color: "#ff9f0a",
    },
    {
      label: "AI Adaptations",
      value: stats?.adaptations?.toString() ?? "—",
      change: "+100%",
      positive: true,
      sparkData: [1, 2, 3, 5, 8, 10, 14, 18, 24],
      color: "#bf5af2",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px", gap: "8px" }}>
        <div>
          <div className="stat-label">Performance Stats</div>
          <h3 style={{ fontSize: "17px", fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>Your Metrics</h3>
        </div>
        {isTop && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              fontSize: "10px",
              background: "rgba(0,113,227,0.12)",
              color: "#2997ff",
              padding: "3px 10px",
              borderRadius: "980px",
              border: "0.5px solid rgba(0,113,227,0.25)",
              fontWeight: 600,
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            TOP PRIORITY
          </motion.span>
        )}
      </div>

      {/* 2×2 stat grid — responsive via CSS class */}
      <div className="stats-inner-grid">
        {dynamicStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              background: "var(--bg-tertiary)",
              border: "0.5px solid var(--border)",
              borderRadius: "14px",
              padding: "14px 16px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top accent line */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: "2px",
              background: `linear-gradient(90deg, ${stat.color}, transparent)`,
            }} />

            <div className="stat-label">{stat.label}</div>
            <div style={{
              fontSize: "clamp(22px, 3vw, 28px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "2px 0 8px",
            }}>
              {stat.value}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "4px",
                fontSize: "12px",
                color: stat.positive ? "var(--success)" : "var(--danger)",
                fontWeight: 500,
              }}>
                {stat.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {stat.change}
              </div>
              <Sparkline data={stat.sparkData} color={stat.color} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
