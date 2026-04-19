"use client";

import { motion } from "framer-motion";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const VALUES = [42, 67, 38, 85, 71, 55, 63];
const HOURLY = [12, 18, 35, 52, 78, 88, 95, 72, 60, 45, 30, 22, 18, 28, 40, 55, 68, 80, 70, 55, 42, 30, 20, 14];

export function ActivityBarChart({ isTop }: { userId: string; isTop?: boolean }) {
  const currentDay = new Date().getDay();
  const todayIdx = currentDay === 0 ? 6 : currentDay - 1;
  const currentHour = new Date().getHours();
  const max = Math.max(...VALUES);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <div className="stat-label">Activity Overview</div>
          <h3 style={{ fontSize: "18px", fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>Weekly Engagement</h3>
        </div>
        <div style={{ fontSize: "12px", color: "var(--text-tertiary)", fontWeight: 500 }}>
          This week
        </div>
      </div>

      {/* Bar Chart — Apple Health Style */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "110px", padding: "0 4px 0", marginBottom: "8px" }}>
        {VALUES.map((val, i) => {
          const heightPct = (val / max) * 100;
          const isToday = i === todayIdx;
          return (
            <div key={DAYS[i]} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
              <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    width: "100%",
                    borderRadius: "6px 6px 3px 3px",
                    background: isToday
                      ? "linear-gradient(180deg, #2997ff 0%, #0071e3 100%)"
                      : isTop
                      ? `rgba(0,113,227,${0.2 + (val / max) * 0.5})`
                      : `rgba(var(--fg-rgb),${0.05 + (val / max) * 0.15})`,
                    boxShadow: isToday ? "0 0 12px rgba(0,113,227,0.4)" : "none",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {isToday && (
                    <motion.div
                      style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(var(--fg-rgb),0.15) 0%, transparent 60%)" }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              </div>
              <div style={{ fontSize: "10px", color: isToday ? "#2997ff" : "var(--text-tertiary)", fontWeight: isToday ? 600 : 400 }}>
                {DAYS[i]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini Hourly Heatmap */}
      <div style={{ marginTop: "12px" }}>
        <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginBottom: "6px", fontWeight: 500 }}>Hourly activity today</div>
        <div style={{ display: "flex", gap: "3px", height: "18px", alignItems: "center" }}>
          {HOURLY.map((v, i) => {
            const isCurrent = i === currentHour;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.015 }}
                style={{
                  flex: 1,
                  height: `${30 + (v / 100) * 70}%`,
                  borderRadius: "2px",
                  background: isCurrent
                    ? "#0071e3"
                    : `rgba(0,113,227,${0.05 + (v / 100) * 0.5})`,
                  boxShadow: isCurrent ? "0 0 6px rgba(0,113,227,0.5)" : "none",
                }}
              />
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
          <span style={{ fontSize: "9px", color: "var(--text-tertiary)" }}>12am</span>
          <span style={{ fontSize: "9px", color: "var(--accent)" }}>Now ({currentHour}:00)</span>
          <span style={{ fontSize: "9px", color: "var(--text-tertiary)" }}>11pm</span>
        </div>
      </div>
    </div>
  );
}


