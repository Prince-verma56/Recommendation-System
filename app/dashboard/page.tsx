import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { PersonalizedGrid } from "@/components/dashboard/PersonalizedGrid";
import { AIInsightCard } from "@/components/dashboard/AIInsightCard";
import { WeeklyChart } from "@/components/dashboard/WeeklyChart";
import { HourlyStrip } from "@/components/dashboard/HourlyStrip";
import { DemoFAB } from "@/components/dashboard/DemoFAB";
import { BehaviorPanel } from "@/components/dashboard/BehaviorPanel";

export const metadata = {
  title: "Dashboard — PersonaUI",
  description: "Your adaptive workspace, shaped by your behavior in real-time.",
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <>
      <Navbar />

      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(0,113,227,0.08) 0%, transparent 55%)",
        }}
      />

      <main
        style={{
          minHeight: "100vh",
          maxWidth: "1120px",
          margin: "0 auto",
          width: "100%",
          padding: "28px 20px 100px",
        }}
      >
        {/* ── Compact Hero ─────────────────────────────────────── */}
        <div style={{ marginBottom: "28px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "11px",
              fontWeight: 600,
              color: "rgba(0,113,227,0.85)",
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              padding: "3px 12px",
              background: "rgba(0,113,227,0.09)",
              border: "0.5px solid rgba(0,113,227,0.2)",
              borderRadius: "980px",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#0071e3",
                display: "inline-block",
              }}
            />
            {getGreeting()}
          </div>
          <h1
            style={{
              fontSize: "clamp(26px, 3.5vw, 38px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "0 0 6px",
              background:
                "linear-gradient(135deg, var(--text-primary) 0%, rgba(var(--fg-rgb),0.55) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Your workspace, shaped by you.
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(var(--fg-rgb),0.4)",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Reorders based on dwell time, scroll depth, and click patterns
          </p>
        </div>

        {/* ── Top Row: AI Insight Banner ─────────────────────────── */}
        <div style={{ marginBottom: "14px" }}>
          <AIInsightCard userId={userId} />
        </div>

        {/* ── Middle: Reorderable Widget Grid ───────────────────── */}
        <PersonalizedGrid userId={userId} />

        {/* ── Bottom: Activity Overview ──────────────────────────── */}
        <div className="bento-card" style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <div>
              <div className="stat-label">Activity Overview</div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                Weekly Engagement
              </h3>
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-tertiary)",
                fontWeight: 500,
              }}
            >
              Last 7 days
            </div>
          </div>

          {/* Real bar chart */}
          <WeeklyChart userId={userId} />

          {/* Divider */}
          <div
            style={{
              height: "0.5px",
              background: "var(--border)",
              margin: "18px 0",
            }}
          />

          {/* Hourly strip */}
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-tertiary)",
                fontWeight: 500,
                marginBottom: "8px",
                letterSpacing: "0.3px",
                textTransform: "uppercase",
              }}
            >
              Today's activity by hour
            </div>
            <HourlyStrip userId={userId} />
          </div>
        </div>
      </main>

      {/* Floating Demo Reset Button */}
      <DemoFAB />

      {/* Behavioral Intelligence Panel (bottom-left) */}
      <BehaviorPanel />
    </>
  );
}
