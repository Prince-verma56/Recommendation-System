"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface Props {
  userId: string;
  message?: string | null;
}

function useTypewriter(text: string, speed = 28) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
}

const DEFAULT_MESSAGE = "Observing your workflow. Sections below will adapt based on where you spend time.";

export function AIInsightBubble({ userId, message }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeMessage = message ?? DEFAULT_MESSAGE;
  const typed = useTypewriter(activeMessage, 22);

  return (
    <motion.div
      className="flex justify-center my-8 px-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        layout
        onClick={() => setIsExpanded(v => !v)}
        className="dynamic-island cursor-pointer select-none"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: isExpanded ? "14px 22px" : "10px 20px",
          maxWidth: isExpanded ? "560px" : "360px",
          width: "100%",
          transition: "max-width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Pulsing AI Orb */}
        <motion.div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0071e3, #2997ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 0 12px rgba(0,113,227,0.5)",
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={13} color="#fff" strokeWidth={2} />
        </motion.div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(0,113,227,0.9)", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "2px" }}>
            AI Insight
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeMessage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: "13px", color: "rgba(var(--fg-rgb),0.75)", lineHeight: 1.5, margin: 0, whiteSpace: isExpanded ? "normal" : "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {typed}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Indicator dot */}
        <motion.div
          style={{ width: 6, height: 6, borderRadius: "50%", background: "#0071e3", flexShrink: 0 }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}


