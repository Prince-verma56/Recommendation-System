"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, Calendar, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Prediction {
  label: string;
  time: string;
  icon: React.ReactNode;
  confidence: number;
  cta?: string;
}

function getTimeGreeting(hour: number) {
  if (hour < 12) return "Morning Focus";
  if (hour < 17) return "Afternoon Session";
  return "Evening Review";
}

function getHourLabel(h: number) {
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h > 12 ? h - 12 : h || 12;
  return `${display}:00 ${suffix}`;
}

export function TimePredictionCard({ isTop }: { userId: string; isTop?: boolean }) {
  const [hour, setHour] = useState(new Date().getHours());
  const [minuteStr, setMinuteStr] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setHour(now.getHours());
      setMinuteStr(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  const predictions: Prediction[] = [
    {
      label: "Daily Sync Prep",
      time: getHourLabel(hour + 1),
      icon: <Calendar size={14} />,
      confidence: 92,
      cta: "Join Call",
    },
    {
      label: "Analytics Deep-Dive",
      time: getHourLabel(hour + 2),
      icon: <Zap size={14} />,
      confidence: 78,
    },
    {
      label: "Review Queue",
      time: getHourLabel(hour + 3),
      icon: <Clock size={14} />,
      confidence: 65,
    },
  ];

  return (
    <div className="thinking-card" style={{ borderRadius: "16px", padding: "20px", position: "relative", overflow: "hidden" }}>
      {/* Subtle scan line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(180deg, transparent 0%, rgba(0,113,227,0.03) 50%, transparent 100%)",
        backgroundSize: "100% 200%",
        animation: "scanLine 8s linear infinite",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div className="stat-label">AI Oracle</div>
          <h3 style={{ fontSize: "18px", fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>
            {getTimeGreeting(hour)}
          </h3>
        </div>
        <motion.div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            background: "rgba(0,113,227,0.12)",
            border: "0.5px solid rgba(0,113,227,0.3)",
            borderRadius: "980px",
          }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            style={{ width: 6, height: 6, borderRadius: "50%", background: "#0071e3" }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span style={{ fontSize: "11px", color: "#2997ff", fontWeight: 600 }}>PREDICTING</span>
        </motion.div>
      </div>

      {/* Time Display */}
      <motion.div
        style={{ textAlign: "center", marginBottom: "20px" }}
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="shimmer-text" style={{ fontSize: "40px", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>
          {minuteStr}
        </div>
        <div style={{ fontSize: "12px", color: "rgba(0,113,227,0.8)", marginTop: "4px", fontWeight: 500 }}>
          Preparing your workflow
        </div>
      </motion.div>

      {/* Predictions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {predictions.map((pred, i) => (
          <motion.div
            key={pred.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              background: "rgba(var(--fg-rgb),0.03)",
              border: "0.5px solid rgba(var(--fg-rgb),0.06)",
              borderRadius: "12px",
            }}
          >
            <div style={{ color: "#2997ff", flexShrink: 0 }}>{pred.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>{pred.label}</div>
              <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "1px" }}>{pred.time}</div>
            </div>
            {/* Confidence bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: 40, height: 3, background: "rgba(var(--fg-rgb),0.08)", borderRadius: "2px", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pred.confidence}%` }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                  style={{ height: "100%", background: `rgba(0,113,227,${pred.confidence / 100})`, borderRadius: "2px" }}
                />
              </div>
              <span style={{ fontSize: "10px", color: "var(--text-tertiary)", width: "24px" }}>{pred.confidence}%</span>
            </div>
            {pred.cta && (
              <button className="btn-pill btn-pill-primary" style={{ padding: "6px 14px", fontSize: "12px" }}>
                {pred.cta}
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}


