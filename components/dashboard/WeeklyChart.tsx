"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef } from "react";

interface Props {
  userId: string;
}

export function WeeklyChart({ userId }: Props) {
  const data = useQuery(api.personas.getWeeklyEngagement, { userId });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const tooltip = tooltipRef.current;
    if (!canvas || !data || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.scale(DPR, DPR);

    const max = Math.max(...data.map((d) => d.count), 1);
    const barCount = data.length;
    const gap = 6;
    const totalGap = gap * (barCount - 1);
    const barW = (W - totalGap) / barCount;
    const todayDowIndex = new Date().getDay();
    // Map JS day (0=Sun) to our Mon-Sun array (0=Mon..6=Sun)
    const todayBarIndex = todayDowIndex === 0 ? 6 : todayDowIndex - 1;

    ctx.clearRect(0, 0, W, H);

    data.forEach((d, i) => {
      const heightPct = d.count / max;
      const barH = Math.max(4, heightPct * (H - 22));
      const x = i * (barW + gap);
      const y = H - barH - 16;
      const r = 4;
      const isToday = i === todayBarIndex;

      // Bar fill
      if (isToday) {
        const grad = ctx.createLinearGradient(x, y, x, y + barH);
        grad.addColorStop(0, "#2997ff");
        grad.addColorStop(1, "#0071e3");
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = `rgba(0, 113, 227, ${0.12 + heightPct * 0.45})`;
      }

      // Rounded-top bar
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + barW - r, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
      ctx.lineTo(x + barW, y + barH);
      ctx.lineTo(x, y + barH);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();

      // Glow on today's bar
      if (isToday) {
        ctx.shadowColor = "rgba(0,113,227,0.5)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Day label
      ctx.fillStyle = isToday
        ? "#2997ff"
        : "rgba(var(--fg-rgb, 255,255,255), 0.3)";
      ctx.font = `${isToday ? "600" : "400"} 9px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = isToday ? "#2997ff" : "rgba(180,180,190,0.6)";
      ctx.fillText(d.day, x + barW / 2, H - 2);
    });

    // Tooltip on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!tooltip) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const barIndex = Math.floor(mx / (barW + gap));
      const item = data[barIndex];
      if (item) {
        tooltip.style.display = "block";
        tooltip.style.left = `${e.clientX - rect.left + 8}px`;
        tooltip.style.top = `${e.clientY - rect.top - 28}px`;
        tooltip.textContent = `${item.day}: ${item.count} events`;
      }
    };
    const handleMouseLeave = () => {
      if (tooltip) tooltip.style.display = "none";
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [data]);

  return (
    <div style={{ position: "relative", width: "100%", height: 90 }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      <div
        ref={tooltipRef}
        style={{
          display: "none",
          position: "absolute",
          background: "rgba(10,10,15,0.92)",
          border: "0.5px solid rgba(0,113,227,0.3)",
          borderRadius: 8,
          padding: "4px 8px",
          fontSize: 11,
          fontWeight: 500,
          color: "#f5f5f7",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          zIndex: 10,
        }}
      />
      {(!data || data.every((d) => d.count === 0)) && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: "var(--text-tertiary)",
          }}
        >
          Interact with the dashboard to populate
        </div>
      )}
    </div>
  );
}
