import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HeatmapCanvas, SessionTimeline } from "@/components/analytics/HeatmapCanvas";
import { Navbar } from "@/components/layout/Navbar";
import { DynamicStatsRow } from "@/components/analytics/DynamicStatsRow";
import { AIBehaviorSummary } from "@/components/analytics/AIBehaviorSummary";
import { EngagementLineChart } from "@/components/analytics/EngagementLineChart";
import { AffinityBarChart } from "@/components/analytics/AffinityBarChart";

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

      <main className="w-full max-w-full overflow-x-hidden px-4 md:px-6 lg:px-8 pt-10 pb-20 mx-auto" style={{ maxWidth: "1100px" }}>
        
        {/* Page Header */}
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
            A real-time map of your behavioral fingerprint.
          </p>
        </div>

        {/* ── Strict 12-Column Grid ──────────────────────────── */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* KPI Row */}
          <div className="col-span-12">
            <DynamicStatsRow />
          </div>

          {/* AI Behavioral Summary (span 6) */}
          <div className="col-span-12 lg:col-span-6 flex flex-col h-full">
            <AIBehaviorSummary />
          </div>

          {/* Engagement Line Chart (span 6) */}
          <EngagementLineChart />

          {/* Heatmap Canvas (span 6) */}
          <div className="bento-card col-span-12 lg:col-span-6 flex flex-col p-5">
            <h3 className="text-sm font-semibold tracking-tight mb-4 text-[var(--text-secondary)]">Time-of-Day Section Affinity</h3>
            <HeatmapCanvas />
          </div>

          {/* Live Event Feed (span 6) */}
          <div className="bento-card col-span-12 lg:col-span-6 flex flex-col p-5">
            <h3 className="text-sm font-semibold tracking-tight mb-4 text-[var(--text-secondary)]">Live Event Vector</h3>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <SessionTimeline />
            </div>
          </div>

          {/* Section Affinity Chart (span 12) */}
          <AffinityBarChart />

        </div>
      </main>
    </>
  );
}
