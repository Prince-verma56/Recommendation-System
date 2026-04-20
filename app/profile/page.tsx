import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { UserProfile } from "@clerk/nextjs";

export const metadata = {
  title: "Profile — PersonaUI",
  description: "Manage your persona and personalization settings.",
};

import { PersonaSwitcher } from "@/components/profile/PersonaSwitcher";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <>
      <Navbar />



      <main className="w-full max-w-full overflow-x-hidden px-4 md:px-6 lg:px-8 pt-10 pb-20 mx-auto" style={{ maxWidth: "1100px" }}>

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
            Your Identity
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
            Profile &amp; Persona
          </h1>

          <p style={{
            fontSize: "clamp(13px, 1.5vw, 15px)",
            color: "rgba(var(--fg-rgb),0.4)",
            lineHeight: 1.6,
            margin: 0,
            maxWidth: "500px",
          }}>
            PersonaUI builds your behavioral model automatically. Override or review it here.
          </p>
        </div>

        {/* ── Persona Override Card ─────────────────────── */}
        <div className="bento-card" style={{
          marginBottom: "16px",
        }}>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: 600, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Persona Manual Override
            </h2>
            <p style={{ fontSize: "13px", color: "rgba(var(--fg-rgb),0.4)", lineHeight: 1.55, margin: 0 }}>
              Locking a persona stops the AI from learning your session signals and freezes your layout style.
            </p>
          </div>

          <PersonaSwitcher />
        </div>

        {/* ── Account / Clerk UserProfile ───────────────── */}
        <div className="bento-card">
          <h2 style={{ fontSize: "17px", fontWeight: 600, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
            Account
          </h2>
          <UserProfile
            routing="hash"
            appearance={{
              elements: {
                rootBox: { width: "100%", fontFamily: "inherit" },
                card: {
                  background: "transparent",
                  boxShadow: "none",
                  border: "none",
                  color: "var(--text-primary)",
                },
                navbar: {
                  background: "var(--bg-tertiary)",
                  borderRight: "0.5px solid var(--border)",
                },
                navbarButton: { color: "rgba(var(--fg-rgb),0.6)" },
                navbarButtonActive: { color: "var(--text-primary)", background: "rgba(var(--fg-rgb),0.08)" },
                headerTitle: { color: "var(--text-primary)" },
                profileSectionTitle: { color: "rgba(var(--fg-rgb),0.7)" },
                formFieldLabel: { color: "rgba(var(--fg-rgb),0.6)" },
                formFieldInput: {
                  background: "var(--bg-tertiary)",
                  border: "0.5px solid var(--border)",
                  color: "var(--text-primary)",
                  borderRadius: "10px",
                },
                badge: { background: "rgba(0,113,227,0.15)", color: "#2997ff" },
              },
            }}
          />
        </div>
      </main>
    </>
  );
}


