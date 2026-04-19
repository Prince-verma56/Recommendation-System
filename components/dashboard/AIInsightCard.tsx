"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Clock, Zap } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  userId: string;
}

function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return displayed;
}

const STAT_PILLS = [
  { icon: <TrendingUp size={11} />, label: "Dwell pattern" },
  { icon: <Clock size={11} />, label: "Time-of-day" },
  { icon: <Zap size={11} />, label: "Click density" },
];

const PERSONA_COLORS: Record<string, string> = {
  "Power User":    "#bf5af2",
  "Quick Scanner": "#ff9f0a",
  "Explorer":      "#0071e3",
};

export function AIInsightCard({ userId }: Props) {
  const persona  = useQuery(api.personas.getPersona,   { userId });
  const insight  = useQuery(api.personas.getAIInsight, { userId });

  const accentColor = PERSONA_COLORS[persona?.type ?? "Explorer"] ?? "#0071e3";

  const insightText = insight ?? "Observing your workflow. Sections will adapt as you interact.";
  const typed = useTypewriter(insightText, 16);

  return (
    <div
      style={{
        background: `linear-gradient(130deg, rgba(0,113,227,0.07) 0%, rgba(var(--bg-rgb),0) 65%)`,
        borderRadius: 20,
        padding: "18px 20px",
        border: "0.5px solid rgba(0,113,227,0.18)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient orb */}
      <div
        style={{
          position: "absolute",
          top: -36,
          right: -36,
          width: 110,
          height: 110,
          borderRadius: "50%",
          background: `${accentColor}18`,
          filter: "blur(28px)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <motion.div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0071e3, #2997ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 0 12px rgba(0,113,227,0.4)",
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={13} color="#fff" strokeWidth={2} />
        </motion.div>

        <div>
          <div style={{ fontSize: "10px", fontWeight: 600, color: "rgba(0,113,227,0.8)", letterSpacing: "0.6px", textTransform: "uppercase" }}>
            AI Insight
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={persona?.type ?? "loading"}
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              style={{ fontSize: "11px", fontWeight: 600, color: accentColor }}
            >
              {persona?.type ?? "Learning..."}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Typewriter insight */}
      <AnimatePresence mode="wait">
        <motion.p
          key={insightText.slice(0, 30)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontSize: "13px",
            lineHeight: 1.7,
            color: "rgba(var(--fg-rgb),0.72)",
            margin: "0 0 14px",
            minHeight: 44,
          }}
        >
          {typed}
          {/* blinking cursor while typing */}
          {typed.length < insightText.length && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              style={{
                display: "inline-block",
                width: 2,
                height: 12,
                background: accentColor,
                marginLeft: 2,
                verticalAlign: "middle",
                borderRadius: 1,
              }}
            />
          )}
        </motion.p>
      </AnimatePresence>

      {/* Signal pills */}
      <div style={{ display: "flex", gap: 6 }}>
        {STAT_PILLS.map(({ icon, label }) => (
          <div
            key={label}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 8px",
              background: "rgba(var(--fg-rgb),0.04)",
              border: "0.5px solid rgba(var(--fg-rgb),0.06)",
              borderRadius: 8,
            }}
          >
            <span style={{ color: accentColor, flexShrink: 0 }}>{icon}</span>
            <span style={{ fontSize: "9px", color: "var(--text-tertiary)", fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
