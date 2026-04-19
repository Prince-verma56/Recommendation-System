"use client";
import { motion } from "framer-motion";

const HELP_TIPS: Record<string, string> = {
  stats: "Most users check the weekly trend chart first — scroll down to see it.",
  activity: "Click any event row to expand full details about that session.",
  oracle: "The Oracle predicts your next action — try interacting to see it update.",
  notifications: "Mark all read to clear the counter and reset your notification score.",
};

export function ConfusionAlert({
  section,
  onDismiss,
}: {
  section?: string;
  onDismiss: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "120px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 0 16px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{
          background: "rgba(10,10,15,0.95)",
          backdropFilter: "blur(24px)",
          border: "0.5px solid rgba(255,159,10,0.4)",
          borderRadius: "16px",
          padding: "20px 24px",
          maxWidth: "420px",
          width: "100%",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            color: "#ff9f0a",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            margin: "0 0 8px",
          }}
        >
          Looks like you might be stuck
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.85)",
            margin: "0 0 16px",
            lineHeight: 1.6,
          }}
        >
          {section && HELP_TIPS[section] 
             ? HELP_TIPS[section] 
             : "Try clicking on any element to interact with this section."}
        </p>
        <button
          onClick={onDismiss}
          style={{
            background: "#0071e3",
            color: "#fff",
            border: "none",
            borderRadius: "980px",
            padding: "8px 20px",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Got it
        </button>
      </motion.div>
    </div>
  );
}
