"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Clock, BarChart2 } from "lucide-react";
import { useState, useEffect } from "react";

function useTypewriter(text: string, speed = 20) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      setOut(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
}

// Derive time-of-day affinity from timeSlots data
function useTimeAffinity(userId: string) {
  const weekly = useQuery(api.personas.getWeeklyEngagement, { userId });
  const hourly = useQuery(api.personas.getTodaysHourlyActivity, { userId });

  if (!hourly) return null;

  // Find top 3 hours
  const ranked = hourly
    .map((score, h) => ({ h, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .filter((x) => x.score > 0);

  return ranked.map(({ h, score }) => {
    const label = h < 12 ? `${h === 0 ? "12" : h}am` : h === 12 ? "12pm" : `${h - 12}pm`;
    const pct = score > 0 ? Math.min(100, Math.round((score / Math.max(...hourly, 1)) * 100)) : 0;
    return { label, pct };
  });
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
  stats:         <BarChart2 size={13} />,
  activity:      <TrendingUp size={13} />,
  oracle:        <Sparkles size={13} />,
  notifications: <Clock size={13} />,
};

export function TimePredictionCard({ userId, isTop }: { userId: string; isTop?: boolean }) {
  const insight  = useQuery(api.personas.getAIInsight,            { userId });
  const persona  = useQuery(api.personas.getPersona,              { userId });
  const scored   = useQuery(api.personas.getRankedSectionsByScore, { userId });
  const affinity = useTimeAffinity(userId);

  const insightText = insight ?? "Analyzing your behavioral patterns...";
  const typed = useTypewriter(insightText, 18);

  const [updatedStr, setUpdatedStr] = useState("just now");
  useEffect(() => {
    if (!persona?.updatedAt) return;
    const diff = Math.floor((Date.now() - persona.updatedAt) / 60000);
    setUpdatedStr(diff < 1 ? "just now" : `${diff}m ago`);
  }, [persona?.updatedAt]);

  const top3 = (scored ?? []).slice(0, 3);
  const labelMap: Record<string, string> = {
    stats: "Your Metrics", activity: "Activity", oracle: "AI Oracle", notifications: "Signals",
  };

  return (
    <div
      className="thinking-card"
      style={{ borderRadius: 16, padding: 20, position: "relative", overflow: "hidden", height: "100%" }}
    >
      {/* Scan line */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, transparent 0%, rgba(0,113,227,0.04) 50%, transparent 100%)",
        backgroundSize: "100% 200%",
        animation: "scanLine 8s linear infinite",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div className="stat-label">AI Oracle</div>
          <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>Real-time Prediction</h3>
        </div>
        <motion.div
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px",
            background: "rgba(0,113,227,0.12)", border: "0.5px solid rgba(0,113,227,0.3)", borderRadius: 980 }}
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            style={{ width: 5, height: 5, borderRadius: "50%", background: "#0071e3" }}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span style={{ fontSize: 10, color: "#2997ff", fontWeight: 600 }}>PREDICTING</span>
        </motion.div>
      </div>

      {/* AI insight — typewriter, real Convex data */}
      <AnimatePresence mode="wait">
        <motion.div
          key={insightText.slice(0, 20)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontSize: 13, lineHeight: 1.7,
            color: "rgba(var(--fg-rgb),0.72)",
            background: "rgba(0,113,227,0.06)",
            border: "0.5px solid rgba(0,113,227,0.12)",
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 16,
            minHeight: 64,
          }}
        >
          <span style={{ color: "#2997ff", marginRight: 6 }}>✦</span>
          {typed}
          {typed.length < insightText.length && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.7, repeat: Infinity }}
              style={{ display: "inline-block", width: 2, height: 11, background: "#0071e3",
                marginLeft: 2, verticalAlign: "middle", borderRadius: 1 }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Top 3 ranked sections — from behavioral scoring */}
      {top3.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-tertiary)", letterSpacing: "0.5px",
            textTransform: "uppercase", marginBottom: 8 }}>
            Current Priority Order
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {top3.map((sectionId, i) => (
              <motion.div
                key={sectionId}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 12px",
                  background: i === 0 ? "rgba(0,113,227,0.08)" : "rgba(var(--fg-rgb),0.03)",
                  border: `0.5px solid ${i === 0 ? "rgba(0,113,227,0.2)" : "rgba(var(--fg-rgb),0.05)"}`,
                  borderRadius: 10,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: i === 0 ? "#2997ff" : "var(--text-tertiary)",
                  width: 16, textAlign: "center" }}>
                  #{i + 1}
                </span>
                <span style={{ color: i === 0 ? "#2997ff" : "rgba(var(--fg-rgb),0.4)" }}>
                  {SECTION_ICONS[sectionId] ?? <Clock size={13} />}
                </span>
                <span style={{ fontSize: 12, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? "var(--text-primary)" : "var(--text-secondary)" }}>
                  {labelMap[sectionId] ?? sectionId}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Time affinity peaks */}
      {affinity && affinity.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text-tertiary)", letterSpacing: "0.5px",
            textTransform: "uppercase", marginBottom: 7 }}>
            Peak Activity Hours
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {affinity.map(({ label, pct }) => (
              <div key={label} style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 3, textAlign: "center" }}>{label}</div>
                <div style={{ height: 3, background: "rgba(var(--fg-rgb),0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9 }}
                    style={{ height: "100%", background: "#0071e3", borderRadius: 2 }}
                  />
                </div>
                <div style={{ fontSize: 10, color: "#2997ff", textAlign: "center", marginTop: 2, fontWeight: 600 }}>{pct}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Updated timestamp */}
      <div style={{ marginTop: 14, fontSize: 10, color: "var(--text-tertiary)", textAlign: "right" }}>
        Updated {updatedStr}
      </div>
    </div>
  );
}
