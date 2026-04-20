import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { DemoWidgetGrid } from "@/components/dashboard/DemoWidgetGrid";
import { BehaviorPanel } from "@/components/dashboard/BehaviorPanel";

export const metadata = {
  title: "Live Demo — PersonaUI",
  description: "Experience the real-time behavioral adaptation engine in action.",
};

export default async function DemoPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <>
      <Navbar />

      <main className="w-full max-w-full overflow-x-hidden px-4 md:px-6 lg:px-8 pt-8 pb-28 mx-auto" style={{ maxWidth: "1280px", minHeight: "100vh" }}>
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
            Live Adaptation Showcase
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
            Behavioral Engine Demo
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(var(--fg-rgb),0.4)",
              margin: 0,
              fontWeight: 400,
              maxWidth: "600px",
              lineHeight: 1.6,
            }}
          >
            Interact with the widgets below. As you scroll, dwell, and click, the AI ranks your active patterns to completely reshape the structural flow of the interface in real-time.
          </p>
        </div>

        {/* ── Single Column Vertical Demo Layout ────────────────── */}
        <div className="flex flex-col gap-8">
          <section className="w-full">
            <DemoWidgetGrid userId={userId} />
          </section>
          
          <section className="w-full">
            <BehaviorPanel />
          </section>
        </div>
      </main>
    </>
  );
}
