"use client";
import React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { AppCard } from "@/components/ui/AppCard";
import { 
  Zap, 
  Compass, 
  MousePointer2, 
  Brain,
  CheckCircle2,
  Lock
} from "lucide-react";
import { toast } from "sonner";

export function PersonaOverrideCard() {
  const { user } = useUser();
  const userId = user?.id || "skip";
  
  const setOverride = useMutation(api.preferences.setPersonaOverride);
  const prefs = useQuery(
    api.preferences.getPreferences,
    userId !== "skip" ? { userId } : "skip"
  );

  const personas = [
    { 
      id: "Explorer", 
      label: "Explorer", 
      desc: "Balanced layout with discovery-focused section ranking.", 
      color: "#30d158",
      icon: <Compass size={20} />
    },
    { 
      id: "Quick Scanner", 
      label: "Quick Scanner", 
      desc: "Enhanced visibility for trends and high-level KPIs.", 
      color: "#ff9f0a",
      icon: <MousePointer2 size={20} />
    },
    { 
      id: "Power User", 
      label: "Power User", 
      desc: "Maximum data density. All secondary panels expanded.", 
      color: "#bf5af2",
      icon: <Zap size={20} />
    },
    { 
      id: null, 
      label: "AI Decides", 
      desc: "Restore behavioral autonomy. System learns from session signals.", 
      color: "#0071e3",
      icon: <Brain size={20} />
    },
  ];

  const handleSelect = async (personaId: string | null) => {
    if (userId === "skip") return;
    const toastId = toast.loading("Updating behavioral profile...");
    try {
      await setOverride({ userId, personaOverride: personaId ?? undefined });
      toast.success("Identity Recalibrated", { 
        id: toastId, 
        description: personaId ? `${personaId} configuration is now locked.` : "AI autonomic learning resumed."
      });
    } catch (e) {
      toast.error("Calibration Failed", { id: toastId });
    }
  };

  return (
    <AppCard className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
            <Lock size={18} className="text-zinc-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white leading-tight">Persona Override</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Manual Identity Controls</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
        {personas.map((p) => {
          const isActive = prefs?.personaOverride === p.id || (p.id === null && !prefs?.personaOverride);
          
          return (
            <motion.button
              key={p.label}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSelect(p.id)}
              className={`relative p-5 rounded-3xl border text-left flex flex-col transition-all duration-300 ${
                isActive 
                  ? "bg-zinc-900 border-zinc-700 shadow-[0_12px_40px_rgba(0,0,0,0.4)]" 
                  : "bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-800/40 hover:border-zinc-700/50"
              }`}
            >
              {/* Active Indicator Strip */}
              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    layoutId="active-strip"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                    style={{ backgroundColor: p.color }}
                  />
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between mb-4">
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                    isActive ? "bg-zinc-800 border-zinc-700" : "bg-zinc-800/30 border-zinc-700/20"
                  }`}
                  style={{ color: isActive ? p.color : "rgb(113, 113, 122)" }}
                >
                  {p.icon}
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <CheckCircle2 size={18} style={{ color: p.color }} />
                  </motion.div>
                )}
              </div>

              <div className="mt-auto">
                <h4 className={`text-sm font-bold tracking-tight mb-1.5 ${isActive ? "text-white" : "text-zinc-400"}`}>
                  {p.label}
                </h4>
                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </AppCard>
  );
}
