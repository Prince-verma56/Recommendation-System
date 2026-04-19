"use client";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { RotateCcw, ChevronUp } from "lucide-react";
import { toast } from "sonner";

export function DemoFAB() {
  const { user } = useUser();
  const resetData = useMutation(api.seed.resetUserData);
  const seedData = useMutation(api.seed.seedDemoData);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!user?.id || loading) return;
    setLoading(true);
    try {
      await resetData({ userId: user.id });
      await seedData({ userId: user.id });
      toast.success("Demo reset complete!", {
        description: "Fresh behavioral data seeded. Watch the layout adapt.",
      });
    } catch {
      toast.error("Reset failed. Please try again.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 24,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 10,
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.button
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={handleReset}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              background: "rgba(10,10,15,0.92)",
              backdropFilter: "blur(20px)",
              border: "0.5px solid rgba(255,59,48,0.35)",
              borderRadius: "980px",
              color: "#ff453a",
              fontSize: "12px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              whiteSpace: "nowrap",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <RotateCcw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            {loading ? "Resetting..." : "Reset Demo"}
          </motion.button>
        )}
      </AnimatePresence>

      {/* FAB trigger button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(10,10,15,0.92)",
          backdropFilter: "blur(20px)",
          border: "0.5px solid rgba(var(--fg-rgb),0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "rgba(var(--fg-rgb),0.5)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
        title="Demo controls"
      >
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <ChevronUp size={16} />
        </motion.div>
      </motion.button>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
