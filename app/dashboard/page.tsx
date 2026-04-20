import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";

// Dashboard Components
import { TimePredictionCard } from "@/components/dashboard/TimePredictionCard";
import { PriorityOrderCard } from "@/components/dashboard/PriorityOrderCard";
import { PeakHoursCard } from "@/components/dashboard/PeakHoursCard";
import { StatsBlock } from "@/components/dashboard/StatsBlock";
import { WeeklyChart } from "@/components/dashboard/WeeklyChart";
import { HourlyStrip } from "@/components/dashboard/HourlyStrip";
import { SignalsBlock } from "@/components/dashboard/SignalsBlock";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AdaptationsLog } from "@/components/dashboard/AdaptationsLog";

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
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pt-24 pb-20">
        
        {/* Header Section */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0071e3]/10 border border-[#0071e3]/20 rounded-full mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] shadow-[0_0_8px_#0071e3]" />
            <span className="text-[10px] font-bold text-[#2997ff] uppercase tracking-widest">{getGreeting()}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
            Intelligence Hub
          </h1>
          <p className="text-zinc-500 text-sm md:text-base max-w-2xl leading-relaxed">
            Your interface is dynamically evolving based on your real-time behavioral signals, focus duration, and interaction rhythms.
          </p>
        </header>

        {/* ── Strict 12-Column Bento Grid ────────────────────── */}
        <div className="grid grid-cols-12 gap-6 items-stretch">
          
          {/* Row 1: The "Brain" (Total 12) */}
          <TimePredictionCard />
          <PriorityOrderCard />
          <PeakHoursCard />

          {/* Row 2: Deep Analytics (Total 12) */}
          <StatsBlock />
          <WeeklyChart />

          {/* Row 3: Temporal Rhythm (Full Width) */}
          <HourlyStrip />

          {/* Row 4: Operational Signals (Total 12) */}
          <SignalsBlock />
          <QuickActions />
          <AdaptationsLog />

        </div>
      </main>
    </div>
  );
}
