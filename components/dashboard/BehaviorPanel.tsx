"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Activity, ChevronDown, ChevronUp, RotateCcw, Zap, Clock, MousePointerClick, Eye } from "lucide-react";
import { toast } from "sonner";

function RelativeTime({ ts }: { ts: number }) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return <>{diff}s ago</>;
  if (diff < 3600) return <>{Math.floor(diff / 60)}m ago</>;
  return <>{Math.floor(diff / 3600)}h ago</>;
}

function MetricRow({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
        borderRadius: 10,
        background: "rgba(var(--fg-rgb),0.03)",
        border: "0.5px solid rgba(var(--fg-rgb),0.05)",
        marginBottom: 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: accent ?? "var(--text-tertiary)" }}>{icon}</span>
        <span style={{ fontSize: "12px", color: "var(--text-tertiary)", fontWeight: 500 }}>
          {label}
        </span>
      </div>
      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  );
}

export function BehaviorPanel() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const stats       = useQuery(api.personas.getUserStats,       user?.id ? { userId: user.id } : "skip");
  const persona     = useQuery(api.personas.getPersona,         user?.id ? { userId: user.id } : "skip");
  const scored      = useQuery(api.personas.getRankedSectionsByScore, user?.id ? { userId: user.id } : "skip");
  const resetData   = useMutation(api.seed.resetUserData);
  const seedData    = useMutation(api.seed.seedDemoData);

  const handleReset = async () => {
    if (!user?.id || resetting) return;
    setResetting(true);
    try {
      await resetData({ userId: user.id });
      await seedData({ userId: user.id });
      toast.success("Demo reset!", { description: "Fresh data seeded. Watch the layout adapt." });
    } catch {
      toast.error("Reset failed.");
    } finally {
      setResetting(false);
    }
  };

  const avgDwellSec = stats ? Math.round(stats.avgDwellMs / 1000) : 0;
  const topSection = scored?.[0] ?? "—";
  const labelMap: Record<string, string> = {
    stats: "Your Metrics",
    activity: "Activity Chart",
    oracle: "AI Oracle",
    notifications: "Notifications",
  };

  const SIGNALS = [
    { icon: <Clock size={10} />, label: "Dwell Time" },
    { icon: <MousePointerClick size={10} />, label: "Click Count" },
    { icon: <Eye size={10} />, label: "Scroll Depth" },
    { icon: <Zap size={10} />, label: "Recency Factor" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 50,
        width: open ? 280 : "auto",
        background: "rgba(10,10,15,0.94)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "0.5px solid rgba(var(--fg-rgb),0.1)",
        borderRadius: 18,
        boxShadow: "0 8px 40px rgba(0,0,0,0.45)",
        overflow: "hidden",
        transition: "width 0.3s cubic-bezier(0.25,1,0.5,1)",
      }}
    >
      {/* Header / Toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          padding: "10px 14px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-primary)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 8,
              background: "rgba(0,113,227,0.2)",
              border: "0.5px solid rgba(0,113,227,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity size={12} color="#2997ff" />
          </div>
          {open && (
            <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
              Behavioral Intelligence
            </span>
          )}
        </div>
        {open ? <ChevronDown size={13} color="rgba(var(--fg-rgb),0.4)" /> : null}
      </button>

      {/* Collapsible body */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 14px 14px" }}>
              {/* Persona Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  background: "rgba(0,113,227,0.1)",
                  border: "0.5px solid rgba(0,113,227,0.2)",
                  borderRadius: 10,
                  marginBottom: 8,
                }}
              >
                <div style={{ fontSize: "11px", color: "rgba(0,113,227,0.8)", fontWeight: 600, letterSpacing: "0.4px", textTransform: "uppercase" }}>
                  Persona
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <motion.div
                    style={{ width: 5, height: 5, borderRadius: "50%", background: "#0071e3" }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#2997ff" }}>
                    {persona?.type ?? "Learning..."}
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <MetricRow icon={<MousePointerClick size={12} />} label="Total Events" value={stats?.totalEvents ?? "—"} accent="#0071e3" />
              <MetricRow icon={<Eye size={12} />} label="Avg Dwell" value={avgDwellSec > 0 ? `${avgDwellSec}s` : "—"} accent="#30d158" />
              <MetricRow icon={<Activity size={12} />} label="Avg Scroll Depth" value={stats ? `${stats.avgScrollDepth}%` : "—"} accent="#ff9f0a" />
              <MetricRow icon={<Zap size={12} />} label="Top Section Now" value={labelMap[topSection] ?? topSection} accent="#bf5af2" />
              <MetricRow
                icon={<Clock size={12} />}
                label="Last Adaptation"
                value={persona?.updatedAt ? <RelativeTime ts={persona.updatedAt} /> : "—"}
                accent="#2997ff"
              />

              {/* Signals being tracked */}
              <div style={{ margin: "10px 0 8px" }}>
                <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-tertiary)", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 6 }}>
                  Signals Tracked
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {SIGNALS.map((s) => (
                    <div
                      key={s.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "3px 9px",
                        background: "rgba(var(--fg-rgb),0.06)",
                        border: "0.5px solid rgba(var(--fg-rgb),0.08)",
                        borderRadius: 980,
                        fontSize: "10px",
                        color: "var(--text-secondary)",
                        fontWeight: 500,
                      }}
                    >
                      <span style={{ color: "#2997ff" }}>{s.icon}</span>
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset button */}
              <button
                onClick={handleReset}
                disabled={resetting}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  marginTop: 10,
                  padding: "9px 0",
                  background: "rgba(255,59,48,0.1)",
                  border: "0.5px solid rgba(255,59,48,0.25)",
                  borderRadius: 10,
                  cursor: resetting ? "not-allowed" : "pointer",
                  color: "#ff453a",
                  fontSize: "12px",
                  fontWeight: 600,
                  opacity: resetting ? 0.6 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <RotateCcw
                  size={12}
                  style={{ animation: resetting ? "spin 1s linear infinite" : "none" }}
                />
                {resetting ? "Resetting..." : "Reset Demo Data"}
              </button>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
