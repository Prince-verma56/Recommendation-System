"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";

export function AIToast({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      style={{
        margin: "12px 0 20px",
        background: "rgba(10,10,15,0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "0.5px solid rgba(0,113,227,0.4)",
        borderRadius: "14px",
        padding: "12px 16px",
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        cursor: "pointer",
      }}
      onClick={onDismiss}
    >
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
          background: "#0071e3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          fontWeight: 700,
          color: "#fff",
          flexShrink: 0,
          letterSpacing: "0.5px",
        }}
      >
        AI
      </div>
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#0071e3",
            margin: "0 0 3px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Layout updated
        </p>
        <p
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.85)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {message}
        </p>
      </div>
      <button
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.3)",
          fontSize: "18px",
          cursor: "pointer",
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
    </motion.div>
  );
}
