import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HeatmapCanvas, SessionTimeline } from "@/components/analytics/HeatmapCanvas";
import { Navbar } from "@/components/layout/Navbar";
import { DynamicStatsRow } from "@/components/analytics/DynamicStatsRow";
import { AIBehaviorSummary } from "@/components/analytics/AIBehaviorSummary";
import { EngagementLineChart } from "@/components/analytics/EngagementLineChart";
import { SectionAffinityBars } from "@/components/analytics/SectionAffinityBars";

export const metadata = {
  title: "Analytics — PersonaUI",
  description: "Visualize your behavioral fingerprint and interaction heatmap.",
};

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      <Navbar />

      <main className="max-w-[1300px] mx-auto px-4 md:px-8 pt-24 pb-20">
        
        {/* Page Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0071e3]/10 border border-[#0071e3]/20 rounded-full mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] shadow-[0_0_8px_#0071e3]" />
            <span className="text-[10px] font-bold text-[#2997ff] uppercase tracking-widest">Behavioral Intelligence</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
            Interaction Matrix
          </h1>

          <p className="text-zinc-500 text-sm md:text-base max-w-xl leading-relaxed">
            A real-time decomposition of your digital fingerprint, mapping engagement vectors across time and space.
          </p>
        </div>

        {/* ── Strict 12-Column Grid ──────────────────────────── */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* KPI Row (Full Width) */}
          <div className="col-span-12">
            <DynamicStatsRow />
          </div>

          {/* Top Row: AI Narrative & Trend (6+6) */}
          <div className="col-span-12 lg:col-span-6">
            <AIBehaviorSummary />
          </div>
          <div className="col-span-12 lg:col-span-6">
            <EngagementLineChart />
          </div>

          {/* Middle Row: The Dual Affinity View (6+6) */}
          <div className="col-span-12 lg:col-span-6 bg-zinc-900/10 rounded-2xl border border-zinc-800/30 p-6 flex flex-col min-h-[360px]">
            <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-6">Temporal affinity</h3>
            <div className="flex-1 overflow-x-auto custom-scrollbar">
               <HeatmapCanvas />
            </div>
          </div>
          
          <div className="col-span-12 lg:col-span-6">
            <SectionAffinityBars />
          </div>

          {/* Bottom Row: Live Stream (Full Width or split) */}
          <div className="col-span-12 bg-zinc-900/10 rounded-2xl border border-zinc-800/30 p-6">
            <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-6">Live Event Vector Stream</h3>
            <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <SessionTimeline />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
