import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HeatmapCanvas, SessionTimeline } from "@/components/analytics/HeatmapCanvas";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = {
  title: "Analytics — PersonaUI",
  description: "Visualize your behavioral fingerprint and interaction heatmap.",
};

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <>
      <Navbar />



      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* ── Page Header ───────────────────────────────── */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center",
            fontSize: "12px", fontWeight: 600, color: "rgba(0,113,227,0.9)",
            letterSpacing: "0.6px", textTransform: "uppercase",
            padding: "4px 14px",
            background: "rgba(0,113,227,0.1)",
            border: "0.5px solid rgba(0,113,227,0.2)",
            borderRadius: "980px",
            marginBottom: "14px",
          }}>
            Behavioral Intelligence
          </div>

          <h1 style={{
            fontSize: "clamp(26px, 4vw, 44px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            margin: "0 0 10px",
            background: "linear-gradient(135deg, var(--text-primary) 0%, rgba(var(--fg-rgb),0.6) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Interaction Analytics
          </h1>

          <p style={{
            fontSize: "clamp(13px, 1.5vw, 15px)",
            color: "rgba(var(--fg-rgb),0.45)",
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: "540px",
            margin: 0,
          }}>
            A real-time map of your behavioral fingerprint. PersonaUI uses these signals
            to proactively reorganize your workspace before you even ask.
          </p>
        </div>

        {/* ── Stats Row — 3-col responsive grid ─────────── */}
        <div className="analytics-stat-grid">
          {[
            { label: "Sections Tracked", value: "4",   sub: "Dashboard sections",    color: "#0071e3" },
            { label: "Hours Monitored",   value: "9",   sub: "9am – 5pm window",       color: "#30d158" },
            { label: "Adaptations Today", value: "—",   sub: "Live updating",           color: "#bf5af2" },
          ].map(stat => (
            <div key={stat.label} className="bento-card" style={{
              padding: "20px",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: "2px",
                background: `linear-gradient(90deg, ${stat.color}, transparent)`,
              }} />
              <div className="stat-label">{stat.label}</div>
              <div style={{ fontSize: "32px", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "2px 0 4px" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Heatmap Section ───────────────────────────── */}
        <div className="bento-card" style={{
          marginBottom: "16px",
        }}>
          <div style={{ marginBottom: "4px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: 600, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Time-of-Day Section Affinity
            </h2>
            <p style={{ fontSize: "13px", color: "rgba(var(--fg-rgb),0.4)", lineHeight: 1.55, margin: 0 }}>
              Brighter orbs = higher engagement at that hour. PersonaUI surfaces those sections
              first when that time window approaches next time.
            </p>
          </div>
          <HeatmapCanvas />
        </div>

        {/* ── Session Timeline ────────────────────────────── */}
        <div className="bento-card" style={{ marginBottom: "16px" }}>
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: 600, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Recent Events
            </h2>
            <p style={{ fontSize: "13px", color: "rgba(var(--fg-rgb),0.4)", lineHeight: 1.55, margin: 0 }}>
              Your latest interactions continuously flowing into the behavior log.
            </p>
          </div>
          <SessionTimeline />
        </div>

        {/* ── How It Works ──────────────────────────────── */}
        <div className="bento-card">
          <h2 style={{ fontSize: "17px", fontWeight: 600, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
            How PersonaUI learns
          </h2>

          <div className="learn-grid">
            {[
              {
                emoji: "👁️",
                title: "Dwell Tracking",
                desc: "Measures time spent in each visible section per session.",
                color: "#0071e3",
              },
              {
                emoji: "📜",
                title: "Scroll Velocity",
                desc: "Fast scrolls = skip signals. Slow scrolls = interest signals.",
                color: "#30d158",
              },
              {
                emoji: "🧠",
                title: "Persona Mapping",
                desc: "Classifies you as Quick Scanner, Deep Diver, or Explorer.",
                color: "#bf5af2",
              },
              {
                emoji: "⚡",
                title: "Zero-Click Layout",
                desc: "Rearranges sections silently — no drag-and-drop required.",
                color: "#ff9f0a",
              },
            ].map(item => (
              <div key={item.title} style={{
                display: "flex", gap: "14px", alignItems: "flex-start",
                padding: "16px",
                background: "var(--bg-tertiary)",
                borderRadius: "14px",
                border: "0.5px solid rgba(var(--fg-rgb),0.04)",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "10px",
                  background: `${item.color}18`,
                  border: `0.5px solid ${item.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", flexShrink: 0,
                }}>
                  {item.emoji}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px", letterSpacing: "-0.01em" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-tertiary)", lineHeight: 1.55 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}


