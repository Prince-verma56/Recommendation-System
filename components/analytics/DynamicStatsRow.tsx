"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

export function DynamicStatsRow() {
  const { user } = useUser();
  const stats = useQuery(
    api.personas.getDetailedStats,
    user?.id ? { userId: user.id } : "skip"
  );

  const statItems = [
    { label: "Sections Tracked", value: stats?.sectionsTracked ?? "—", sub: "Dashboard sections", color: "#0071e3" },
    { label: "Hours Monitored",  value: stats?.hoursMonitored ?? "—", sub: "Active time blocks", color: "#30d158" },
    { label: "Adaptations Today", value: stats?.adaptationsToday ?? "—", sub: "Live updating", color: "#bf5af2" },
  ];

  return (
    <div className="analytics-stat-grid">
      {statItems.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bento-card"
          style={{ padding: "20px", position: "relative" }}
        >
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "2px",
            background: `linear-gradient(90deg, ${stat.color}, transparent)`,
          }} />
          <div className="stat-label">{stat.label}</div>
          <div style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "2px 0 4px" }}>
            {stat.value}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>{stat.sub}</div>
        </motion.div>
      ))}
    </div>
  );
}
