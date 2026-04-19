"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

// Analytics CSS overrides can remain clean using standard React generic styling
export function HeatmapCanvas() {
  const { user } = useUser();
  const slots = useQuery(
    api.personas.getAllTimeSlots,
    user?.id ? { userId: user.id } : "skip"
  );

  const SECTIONS = ["stats", "analytics", "actions", "notifications"];
  const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  const maxScore = slots && slots.length > 0
    ? Math.max(...slots.map((s) => s.score), 1)
    : 1;

  // Render a responsive grid rather than static canvas for hover-effects
  return (
    <div style={{ padding: "0 10px 10px 0", overflowX: "auto" }}>
      <div style={{ minWidth: "500px" }}>
        {/* Header row / Timeline Hours */}
        <div style={{ display: "flex", marginLeft: "80px", marginBottom: "8px" }}>
          {HOURS.map((h, i) => {
            const label = h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`;
            return (
              <div key={h} style={{ flex: 1, textAlign: "center", fontSize: "10px", color: "var(--text-tertiary)" }}>
                {label}
              </div>
            );
          })}
        </div>

        {/* Section Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {SECTIONS.map((section, si) => (
            <div key={section} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "80px", fontSize: "11px", color: "var(--text-secondary)", textTransform: "capitalize" }}>
                {section}
              </div>
              <div style={{ display: "flex", flex: 1, gap: "4px" }}>
                {HOURS.map((hour, hi) => {
                  const slot = slots?.find(s => s.section === section && s.hour === hour);
                  const intensity = slot ? Math.min(slot.score / maxScore, 1) : 0;
                  const alpha = Math.max(0.04, intensity);

                  return (
                    <motion.div
                      key={hour}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (si * 0.05) + (hi * 0.02) }}
                      title={`${section} at ${hour}:00 — Score: ${slot?.score || 0}`}
                      style={{
                        flex: 1,
                        height: "28px",
                        borderRadius: "4px",
                        background: `rgba(0, 113, 227, ${alpha})`,
                        border: "0.5px solid rgba(0, 113, 227, 0.1)",
                        cursor: "crosshair",
                        transition: "transform 0.1s"
                      }}
                      whileHover={{ scale: 1.15, zIndex: 10, background: `rgba(0, 113, 227, ${Math.max(0.4, alpha + 0.3)})` }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// SessionTimeline component — real events from Convex
export function SessionTimeline() {
  const { user } = useUser();
  const events = useQuery(
    api.personas.getRecentEvents,
    user?.id ? { userId: user.id, limit: 10 } : "skip"
  );

  if (!events || events.length === 0) {
    return (
      <p style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
        No events yet — interact with the dashboard to populate this timeline.
      </p>
    );
  }

  const actionColor: Record<string, string> = {
    click: "#0071e3",
    dwell: "#30d158",
    idle: "#ff9f0a",
    scroll: "#7F77DD",
  };

  const actionLabel: Record<string, string> = {
    click: "Clicked in",
    dwell: "Spent time in",
    idle: "Went idle in",
    scroll: "Scrolled through",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {events.map((event, i) => {
        const color = actionColor[event.action] ?? "#666";
        const label = actionLabel[event.action] ?? event.action;
        const time = new Date(event.ts).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const dwellSec = Math.round((event.dwellMs ?? 0) / 1000);

        return (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            key={event._id}
            style={{ 
              display: "flex", gap: "12px", alignItems: "flex-start",
              padding: "10px 14px",
              background: "var(--bg-tertiary)",
              border: "0.5px solid var(--border)",
              borderRadius: "10px"
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: color,
                flexShrink: 0,
                marginTop: "4px",
                boxShadow: `0 0 8px ${color}80`
              }}
            />
            <div>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0 }}>
                {label} <strong style={{ color }}>{event.section}</strong>
                {dwellSec > 0 && (
                  <span style={{ color: "var(--text-tertiary)", fontSize: "12px" }}>
                    {" "}— {dwellSec}s
                  </span>
                )}
              </p>
              <p style={{ fontSize: "11px", color: "var(--text-tertiary)", margin: "2px 0 0" }}>
                {time}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
