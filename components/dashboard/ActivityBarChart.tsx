"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";

export function ActivityBarChart({ userId, isTop }: { userId: string; isTop?: boolean }) {
  const weekly = useQuery(api.personas.getWeeklyEngagement,       { userId });
  const hourly = useQuery(api.personas.getTodaysHourlyActivity,   { userId });

  const weeklyData = weekly ?? [];
  const hourlyData = hourly ?? new Array(24).fill(0);

  const currentDay  = new Date().getDay();
  const todayDowIdx = currentDay === 0 ? 6 : currentDay - 1; // Mon=0 in our dataset
  const currentHour = new Date().getHours();

  const weeklyMax = Math.max(...weeklyData.map((d) => d.count), 1);
  const hourlyMax = Math.max(...hourlyData, 1);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div className="stat-label">Activity Overview</div>
          <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>Weekly Engagement</h3>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontWeight: 500 }}>This week</div>
      </div>

      {/* Weekly bar chart — real Convex data */}
      {weeklyData.length > 0 ? (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 110, padding: "0 4px", marginBottom: 8 }}>
          {weeklyData.map((d, i) => {
            const heightPct = (d.count / weeklyMax) * 100;
            const isToday   = i === todayDowIdx;
            return (
              <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(4, heightPct)}%` }}
                    transition={{ delay: i * 0.06, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                    title={`${d.day}: ${d.count} events`}
                    style={{
                      width: "100%",
                      borderRadius: "6px 6px 3px 3px",
                      background: isToday
                        ? "linear-gradient(180deg, #2997ff 0%, #0071e3 100%)"
                        : isTop
                        ? `rgba(0,113,227,${0.15 + (d.count / weeklyMax) * 0.55})`
                        : `rgba(var(--fg-rgb),${0.04 + (d.count / weeklyMax) * 0.18})`,
                      boxShadow: isToday ? "0 0 10px rgba(0,113,227,0.4)" : "none",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {isToday && (
                      <motion.div
                        style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(var(--fg-rgb),0.12) 0%, transparent 60%)" }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                </div>
                <div style={{ fontSize: 10, color: isToday ? "#2997ff" : "var(--text-tertiary)", fontWeight: isToday ? 600 : 400 }}>
                  {d.day}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Skeleton while loading
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 110, marginBottom: 8 }}>
          {new Array(7).fill(0).map((_, i) => (
            <motion.div
              key={i}
              style={{ flex: 1, height: `${20 + Math.random() * 50}%`, borderRadius: "6px 6px 3px 3px",
                background: "rgba(var(--fg-rgb),0.05)", overflow: "hidden", position: "relative" }}
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>
      )}

      {/* Real hourly heatmap strip */}
      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 6, fontWeight: 500 }}>Hourly activity today</div>
        <div style={{ display: "flex", gap: 3, height: 20, alignItems: "center" }}>
          {hourlyData.map((v: number, i: number) => {
            const isCurrent = i === currentHour;
            const intensity = v / hourlyMax;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.015 }}
                title={`${i}:00 — dwell: ${Math.round(v / 1000)}s`}
                style={{
                  flex: 1,
                  height: `${20 + intensity * 80}%`,
                  borderRadius: 2,
                  background: isCurrent
                    ? "#0071e3"
                    : `rgba(0,113,227,${0.06 + intensity * 0.65})`,
                  boxShadow: isCurrent ? "0 0 6px rgba(0,113,227,0.5)" : "none",
                }}
              />
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 9, color: "var(--text-tertiary)" }}>12am</span>
          <span style={{ fontSize: 9, color: "var(--accent)" }}>Now ({currentHour}:00)</span>
          <span style={{ fontSize: 9, color: "var(--text-tertiary)" }}>11pm</span>
        </div>
      </div>
    </div>
  );
}
