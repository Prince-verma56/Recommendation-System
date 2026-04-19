"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, MousePointerClick, Eye, Zap, Clock, TrendingUp } from "lucide-react";

interface SignalBarProps { label: string; value: number; max: number; color: string; icon: React.ReactNode }
function SignalBar({ label, value, max, color, icon }: SignalBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color, opacity: 0.8 }}>{icon}</span>
          <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
          {value > 0 ? value.toLocaleString() : "—"}
        </span>
      </div>
      <div style={{ height: 4, background: "rgba(var(--fg-rgb),0.06)", borderRadius: 2, overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ height: "100%", background: `linear-gradient(90deg, ${color}, ${color}99)`, borderRadius: 2 }}
        />
      </div>
    </div>
  );
}

export function NotificationsBlock({ userId, isTop }: { userId: string; isTop?: boolean }) {
  const stats  = useQuery(api.personas.getUserStats,            { userId });
  const persona = useQuery(api.personas.getPersona,             { userId });
  const scored = useQuery(api.personas.getRankedSectionsByScore, { userId });

  const topSection = scored?.[0] ?? "—";
  const sectionLabel: Record<string, string> = {
    stats: "Your Metrics", activity: "Activity", oracle: "AI Oracle", notifications: "Signals",
  };

  const personaColors: Record<string, string> = {
    "Power User": "#bf5af2", "Quick Scanner": "#ff9f0a", "Explorer": "#0071e3",
  };
  const pColor = personaColors[persona?.type ?? "Explorer"] ?? "#0071e3";

  const confidence = stats?.totalEvents
    ? Math.min(99, Math.round(40 + stats.totalEvents * 0.8))
    : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <div className="stat-label">Behavioral Signals</div>
          <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>Live Intelligence</h3>
        </div>
        {/* Live pulse */}
        <motion.div
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px",
            background: "rgba(0,113,227,0.1)", border: "0.5px solid rgba(0,113,227,0.25)",
            borderRadius: 980, flexShrink: 0 }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            style={{ width: 5, height: 5, borderRadius: "50%", background: "#0071e3" }}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span style={{ fontSize: 10, color: "#2997ff", fontWeight: 600 }}>LIVE</span>
        </motion.div>
      </div>

      {/* Persona badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={persona?.type ?? "loading"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 14px",
            background: `${pColor}12`,
            border: `0.5px solid ${pColor}30`,
            borderRadius: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: pColor, letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Current Persona
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>
              {persona?.type ?? "Learning..."}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "var(--text-tertiary)", fontWeight: 500 }}>Confidence</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: pColor }}>{confidence > 0 ? `${confidence}%` : "—"}</div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Signal bars — all from Convex */}
      <SignalBar
        label="Events Tracked"
        value={stats?.totalEvents ?? 0}
        max={200}
        color="#0071e3"
        icon={<Activity size={12} />}
      />
      <SignalBar
        label="Avg Dwell (ms)"
        value={stats?.avgDwellMs ?? 0}
        max={30000}
        color="#30d158"
        icon={<Clock size={12} />}
      />
      <SignalBar
        label="Avg Scroll Depth %"
        value={stats?.avgScrollDepth ?? 0}
        max={100}
        color="#ff9f0a"
        icon={<Eye size={12} />}
      />
      <SignalBar
        label="Click Events"
        value={stats?.clickEvents ?? 0}
        max={120}
        color="#bf5af2"
        icon={<MousePointerClick size={12} />}
      />

      {/* Top section now */}
      <div style={{
        marginTop: 4, padding: "8px 12px",
        background: "rgba(var(--fg-rgb),0.04)",
        border: "0.5px solid rgba(var(--fg-rgb),0.07)",
        borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500 }}>
          Top section now
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <TrendingUp size={11} color="#0071e3" />
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
            {sectionLabel[topSection] ?? topSection}
          </span>
        </div>
      </div>
    </div>
  );
}
