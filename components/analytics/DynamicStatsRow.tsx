"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

export function DynamicStatsRow() {
  const { user } = useUser();
  const summary = useQuery(
    api.personas.getDetailedStats,
    user?.id ? { userId: user.id } : "skip"
  );
  const stats = useQuery(
    api.personas.getUserStats,
    user?.id ? { userId: user.id } : "skip"
  );
  const persona = useQuery(
    api.personas.getPersona,
    user?.id ? { userId: user.id } : "skip"
  );

  const activePersona = persona?.override || persona?.persona || "Scanner";

  const statItems = [
    { label: "Total Events", value: stats?.totalEvents ?? "—", sub: "Recorded signals", color: "#ff453a" },
    { label: "Active Sections", value: summary?.sectionsTracked ?? "—", sub: "Interactive bounds", color: "#ff9f0a" },
    { label: "Current Persona", value: activePersona, sub: "Behavior classification", color: "#30d158" },
    { label: "Adaptations", value: summary?.adaptationsToday ?? "—", sub: "Dynamic shifts today", color: "#bf5af2" },
  ];

  return (
    <div className="grid grid-cols-12 gap-4">
      {statItems.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bento-card col-span-6 md:col-span-3"
          style={{ padding: "20px", position: "relative" }}
        >
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "2px",
            background: `linear-gradient(90deg, ${stat.color}, transparent)`,
          }} />
          <div className="stat-label">{stat.label}</div>
          <div style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "4px 0 4px" }} className="capitalize">
            {stat.value}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>{stat.sub}</div>
        </motion.div>
      ))}
    </div>
  );
}
