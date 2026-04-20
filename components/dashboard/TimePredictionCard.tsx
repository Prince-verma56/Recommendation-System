"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { AppCard } from "@/components/ui/AppCard";

function useTypewriter(text: string, speed = 30) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    setOut("");
    const id = setInterval(() => {
      setOut(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
}

export function TimePredictionCard() {
  const { user } = useUser();
  const userId = user?.id || "skip";
  
  const insight = useQuery(api.personas.getAIInsight, userId !== "skip" ? { userId } : "skip");
  const persona = useQuery(api.personas.getPersona, userId !== "skip" ? { userId } : "skip");

  const insightText = insight ?? "Analyzing your behavioral patterns...";
  const typed = useTypewriter(insightText, 25);

  const [updatedStr, setUpdatedStr] = useState("just now");
  useEffect(() => {
    if (!persona?.updatedAt) return;
    const diff = Math.floor((Date.now() - persona.updatedAt) / 60000);
    setUpdatedStr(diff < 1 ? "just now" : `${diff}m ago`);
  }, [persona?.updatedAt]);

  return (
    <AppCard className="col-span-12 lg:col-span-6 flex flex-col h-full relative overflow-hidden">
      {/* Scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0071e3]/5 to-transparent bg-[length:100%_200%] animate-[scanLine_8s_linear_infinite] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">AI Oracle</div>
          <h3 className="text-lg font-bold tracking-tight text-white">Interface Prediction</h3>
        </div>
        <motion.div
          className="flex items-center gap-2 px-3 py-1 bg-[#0071e3]/10 border border-[#0071e3]/20 rounded-full"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#0071e3]"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[10px] text-[#0071e3] font-bold tracking-wider">LIVE</span>
        </motion.div>
      </div>

      {/* Prediction Body */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={insightText.slice(0, 20)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-[#0071e3]/5 border border-[#0071e3]/10 min-h-[100px] flex items-start gap-4"
          >
            <div className="w-8 h-8 rounded-xl bg-[#0071e3]/10 flex items-center justify-center shrink-0">
               <Sparkles size={16} className="text-[#0071e3]" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] leading-relaxed text-zinc-300 font-medium italic">
                "{typed}"
              </p>
              {typed.length < insightText.length && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                  className="inline-block w-1.5 h-4 bg-[#0071e3] ml-1 align-middle rounded-sm"
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-zinc-800 flex items-center justify-center">
            <Brain size={12} className="text-zinc-500" />
          </div>
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Neural Sync</span>
        </div>
        <span className="text-[10px] text-zinc-500 font-medium italic">Updated {updatedStr}</span>
      </div>
    </AppCard>
  );
}
