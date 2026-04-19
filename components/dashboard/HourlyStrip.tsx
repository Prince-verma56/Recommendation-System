"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";

interface Props {
  userId: string;
}

function hourLabel(h: number): string {
  if (h === 0) return "12a";
  if (h === 12) return "12p";
  return h < 12 ? `${h}a` : `${h - 12}p`;
}

export function HourlyStrip({ userId }: Props) {
  const hourly = useQuery(api.personas.getTodaysHourlyActivity, { userId });
  const currentHour = new Date().getHours();

  const safeSamples = hourly ?? new Array(24).fill(0);
  const max = Math.max(...safeSamples, 1);

  return (
    <div>
      {/* Blocks */}
      <div
        style={{
          display: "flex",
          gap: "3px",
          alignItems: "flex-end",
          height: "48px",
        }}
      >
        {safeSamples.map((value: number, h: number) => {
          const intensity = value / max;
          const isCurrent = h === currentHour;
          const isPast = h < currentHour;

          return (
            <motion.div
              key={h}
              title={`${hourLabel(h)}: ${Math.round(value / 1000)}s dwell`}
              initial={{ height: 4, opacity: 0 }}
              animate={{
                height: `${Math.max(10, intensity * 100)}%`,
                opacity: 1,
              }}
              transition={{
                height: {
                  type: "spring",
                  stiffness: 280,
                  damping: 30,
                  delay: h * 0.018,
                },
                opacity: { duration: 0.2, delay: h * 0.018 },
              }}
              style={{
                flex: 1,
                borderRadius: "3px 3px 2px 2px",
                background: isCurrent
                  ? "#0071e3"
                  : isPast
                  ? `rgba(0, 113, 227, ${0.07 + intensity * 0.7})`
                  : `rgba(var(--fg-rgb), 0.05)`,
                boxShadow: isCurrent
                  ? "0 0 8px rgba(0,113,227,0.55)"
                  : "none",
                cursor: "default",
                position: "relative",
              }}
            />
          );
        })}
      </div>

      {/* Hour labels: 12a, 6a, 12p, 6p, 11p */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "5px",
        }}
      >
        {[0, 6, 12, 18, 23].map((h) => (
          <span
            key={h}
            style={{
              fontSize: "9px",
              color: h === currentHour ? "#2997ff" : "var(--text-tertiary)",
              fontWeight: h === currentHour ? 600 : 400,
            }}
          >
            {hourLabel(h)}
          </span>
        ))}
      </div>
    </div>
  );
}
