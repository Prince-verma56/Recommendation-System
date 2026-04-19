"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

function useTypewriter(text: string, speed = 15) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      setOut(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
}

export function AIBehaviorSummary() {
  const { user } = useUser();
  const summary = useQuery(
    api.personas.getAnalyticsSummary,
    user?.id ? { userId: user.id } : "skip"
  );

  const typedSummary = useTypewriter(summary ?? "");

  return (
    <div className="bento-card" style={{ marginBottom: "16px", padding: 0, overflow: "hidden" }}>
      {/* Background Gradient */}
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: "50%",
        background: "radial-gradient(ellipse at right, rgba(0, 113, 227, 0.08) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <div style={{
            padding: "6px",
            background: "rgba(0,113,227,0.1)",
            border: "0.5px solid rgba(0,113,227,0.2)",
            borderRadius: "8px",
            color: "#0071e3"
          }}>
            <Sparkles size={16} />
          </div>
          <h2 style={{ fontSize: "17px", fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>
            AI Behavioral Summary
          </h2>
        </div>

        <div style={{ minHeight: "80px", position: "relative" }}>
          {!summary ? (
             <div style={{
               display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px"
             }}>
               <motion.div style={{ height: "14px", width: "90%", background: "var(--bg-tertiary)", borderRadius: "4px" }} animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
               <motion.div style={{ height: "14px", width: "75%", background: "var(--bg-tertiary)", borderRadius: "4px" }} animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }} />
               <motion.div style={{ height: "14px", width: "60%", background: "var(--bg-tertiary)", borderRadius: "4px" }} animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
             </div>
          ) : (
            <p style={{
              fontSize: "15px",
              color: "rgba(var(--fg-rgb), 0.85)",
              lineHeight: 1.6,
              margin: 0,
            }}>
              {typedSummary}
              {typedSummary.length < summary.length && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.7, repeat: Infinity }}
                  style={{ display: "inline-block", width: 2, height: 14, background: "#0071e3",
                    marginLeft: 4, verticalAlign: "middle", borderRadius: 1 }}
                />
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
