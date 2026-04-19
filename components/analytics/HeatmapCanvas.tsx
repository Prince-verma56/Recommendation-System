"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

// HeatmapCanvas component
export function HeatmapCanvas() {
  const { user } = useUser();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slots = useQuery(
    api.personas.getAllTimeSlots,
    user?.id ? { userId: user.id } : "skip"
  );

  const SECTIONS = ["stats", "analytics", "actions", "notifications"];
  const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const LEFT_PAD = 80;
    const TOP_PAD = 28;
    const cellW = (W - LEFT_PAD) / HOURS.length;
    const cellH = (H - TOP_PAD) / SECTIONS.length;

    ctx.clearRect(0, 0, W, H);

    const maxScore = slots && slots.length > 0
      ? Math.max(...slots.map((s) => s.score), 1)
      : 1;

    // Draw hour labels
    ctx.font = "10px -apple-system, sans-serif";
    ctx.fillStyle = "var(--text-tertiary)";
    HOURS.forEach((h, hi) => {
      const label = h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`;
      ctx.fillText(label, LEFT_PAD + hi * cellW + cellW / 2 - 12, 14);
    });

    // Draw section labels + cells
    SECTIONS.forEach((section, si) => {
      // Section label
      ctx.fillStyle = "var(--text-tertiary)";
      ctx.fillText(section, 4, TOP_PAD + si * cellH + cellH / 2 + 4);

      HOURS.forEach((hour, hi) => {
        const slot = slots?.find(
          (s) => s.section === section && s.hour === hour
        );
        const intensity = slot ? Math.min(slot.score / maxScore, 1) : 0;
        const alpha = Math.max(0.04, intensity);

        ctx.fillStyle = `rgba(0, 113, 227, ${alpha})`;
        const x = LEFT_PAD + hi * cellW + 2;
        const y = TOP_PAD + si * cellH + 2;
        const w = cellW - 4;
        const ch = cellH - 4;
        const r = 4;

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + ch - r);
        ctx.quadraticCurveTo(x + w, y + ch, x + w - r, y + ch);
        ctx.lineTo(x + r, y + ch);
        ctx.quadraticCurveTo(x, y + ch, x, y + ch - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
      });
    });
  }, [slots]);

  return (
    <canvas
      ref={canvasRef}
      width={560}
      height={180}
      style={{ width: "100%", borderRadius: "8px" }}
    />
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
      {events.map((event) => {
        const color = actionColor[event.action] ?? "#666";
        const label = actionLabel[event.action] ?? event.action;
        const time = new Date(event.ts).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const dwellSec = Math.round((event.dwellMs ?? 0) / 1000);

        return (
          <div
            key={event._id}
            style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: color,
                flexShrink: 0,
                marginTop: "4px",
              }}
            />
            <div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>
                {label} <strong style={{ color }}>{event.section}</strong>
                {dwellSec > 0 && (
                  <span style={{ color: "var(--text-tertiary)", fontSize: "11px" }}>
                    {" "}— {dwellSec}s
                  </span>
                )}
              </p>
              <p style={{ fontSize: "10px", color: "var(--text-tertiary)", margin: "2px 0 0" }}>
                {time}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
