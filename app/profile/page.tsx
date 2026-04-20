"use client";
import { useUser, UserProfile } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { BehavioralProfileCard } from "@/components/profile/BehavioralProfileCard";
import { PersonaOverrideCard } from "@/components/profile/PersonaOverrideCard";
import { AppCard } from "@/components/ui/AppCard";

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <>
      <Navbar />

      <main className="max-w-[1300px] mx-auto px-4 md:px-8 pt-24 pb-20 overflow-x-hidden">
        {/* ── Page Header ───────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0071e3]/10 border border-[#0071e3]/20 rounded-full mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0071e3] shadow-[0_0_8px_#0071e3]" />
            <span className="text-[10px] font-bold text-[#2997ff] uppercase tracking-widest">Self-Sovereign Identity</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
            Profile & Persona
          </h1>

          <p className="text-zinc-500 text-sm md:text-base max-w-xl leading-relaxed">
            Manage your behavioral model and core identity metrics. The engine adapts based on your real-time interaction vectors.
          </p>
        </motion.div>

        {/* ── Bento Grid ────────────────────────────── */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          
          {/* Identity Telemetry (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 lg:col-span-5 h-full"
          >
            <BehavioralProfileCard />
          </motion.div>

          {/* Manual Preferences (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 lg:col-span-7 h-full"
          >
            <PersonaOverrideCard />
          </motion.div>

          {/* Account Settings (12 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-12"
          >
            <AppCard className="p-0 overflow-hidden border border-zinc-800/50">
              <div className="px-6 py-5 border-b border-zinc-800/50 bg-zinc-900/20">
                 <h2 className="text-sm font-bold tracking-tight text-white uppercase tracking-wider">Account Security & Preferences</h2>
              </div>
              <div className="p-0">
                <UserProfile
                  routing="hash"
                  appearance={{
                    variables: {
                      colorBackground: '#09090b',
                      colorText: '#e4e4e7',
                      colorTextSecondary: '#71717a',
                      colorPrimary: '#0071e3',
                      colorSuccess: '#30d158',
                      colorDanger: '#ff453a',
                      borderRadius: '16px',
                    },
                    elements: {
                      rootBox: { width: "100%", fontFamily: "inherit" },
                      card: {
                        background: "transparent",
                        boxShadow: "none",
                        border: "none",
                        padding: "0px",
                        width: "100%",
                        maxWidth: "100%"
                      },
                      navbar: {
                        background: "#09090b",
                        borderRight: "1px solid #18181b",
                        padding: "24px 12px"
                      },
                      navbarButton: { 
                        color: "#a1a1aa",
                        borderRadius: "12px",
                        fontSize: "13px",
                        fontWeight: "600",
                        padding: "10px 14px",
                        transition: "all 0.2s"
                      },
                      navbarButtonActive: { 
                        color: "#ffffff", 
                        background: "#18181b",
                        boxShadow: "inset 0 0 0 1px #27272a" 
                      },
                      header: { display: "none" },
                      profileSection: {
                        padding: "32px 40px",
                        borderBottom: "1px solid #18181b"
                      },
                      profileSectionTitle: { 
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: "800",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "16px"
                      },
                      formFieldLabel: { color: "#71717a", fontSize: "11px", fontWeight: "700" },
                      formFieldInput: {
                        background: "#18181b",
                        border: "1px solid #27272a",
                        color: "#ffffff",
                        borderRadius: "12px",
                        padding: "10px 14px",
                        fontSize: "13px"
                      },
                      badge: { 
                        background: "rgba(0,113,227,0.1)", 
                        color: "#2997ff",
                        border: "1px solid rgba(0,113,227,0.2)",
                        fontWeight: "700",
                        fontSize: "10px"
                      },
                      scrollBox: { borderRadius: "0px" },
                      pageScrollBox: { padding: "0" },
                      footer: { display: "none" }
                    },
                  }}
                />
              </div>
            </AppCard>
          </motion.div>

        </div>
      </main>
    </>
  );
}


