import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PersonalizedGrid } from "@/components/dashboard/PersonalizedGrid";
import { AIInsightBubble } from "@/components/dashboard/AIInsightBubble";
import { Navbar } from "@/components/layout/Navbar";

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

      {/* Ambient radial glow */}
      <div style={{
        position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,113,227,0.09) 0%, transparent 60%)",
      }} />

      <main style={{ minHeight: "100vh", maxWidth: "1100px", margin: "0 auto", width: "100%", padding: "40px 20px 80px" }}>
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="hero-section">
          <p className="kicker">{getGreeting()}</p>
          <h1>
            Your workspace,
            <br />
            shaped by you.
          </h1>
          <p className="sub">
            Layout adapts in real-time based on<br className="hidden sm:block" />
            how you actually work.
          </p>
        </section>

        {/* ── Dynamic Island ────────────────────────────── */}
        <AIInsightBubble userId={userId} />

        {/* ── Bento Grid ───────────────────────────────── */}
        <PersonalizedGrid userId={userId} />
      </main>
    </>
  );
}

