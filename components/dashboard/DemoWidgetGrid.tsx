"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { GripVertical, Sparkles, Brain } from "lucide-react";
import { useConfusionDetect } from "@/hooks/useConfusionDetect";
import { useTracker } from "@/hooks/useTracker";

// Widget section components
import { StatsBlock as StatsSection } from "./StatsBlock";
import { ActivityBarChart as ActivitySection } from "./ActivityBarChart";
import { TimePredictionCard as OracleSection } from "./TimePredictionCard";
import { NotificationsBlock as NotificationsSection } from "./NotificationsBlock";
import { ConfusionAlert } from "./ConfusionAlert";
import { AIToast } from "@/components/ui/AIToast";

// ── Constants ───────────────────────────────────────────────────────────────
const SECTION_MAP: Record<
  string,
  any
> = {
  stats: StatsSection,
  activity: ActivitySection,
  oracle: OracleSection,
  notifications: NotificationsSection,
};

const DEFAULT_ORDER = ["stats", "activity", "oracle", "notifications"];

const SECTION_LABELS: Record<string, string> = {
  stats: "Your Metrics",
  activity: "Activity Chart",
  oracle: "AI Oracle",
  notifications: "Notifications",
};

// How frequently (ms) we re-check if the server score order has changed
const SCORE_POLL_INTERVAL = 5000; // 5 seconds for live demo responsiveness

// ── Loading skeleton ────────────────────────────────────────────────────────
function SectionSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{
        height: 160,
        borderRadius: 20,
        background: "var(--bg-secondary)",
        border: "0.5px solid var(--border)",
        marginBottom: 14,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(var(--fg-rgb),0.04) 50%, transparent 100%)",
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

// ── "Learning" pulsing indicator ───────────────────────────────────────────
function LearningBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        background: "rgba(0,113,227,0.1)",
        border: "0.5px solid rgba(0,113,227,0.25)",
        borderRadius: "980px",
        fontSize: "11px",
        fontWeight: 600,
        color: "#2997ff",
        letterSpacing: "0.3px",
        marginBottom: 12,
      }}
    >
      <motion.div
        style={{ width: 6, height: 6, borderRadius: "50%", background: "#0071e3" }}
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
      <Brain size={11} />
      Analyzing your behavior patterns...
    </motion.div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export function DemoWidgetGrid({ userId }: { userId: string }) {
  useTracker({ section: "demo_grid" });
  const { isConfused, dismiss } = useConfusionDetect();

  // ── Convex data ──────────────────────────────────────────────────────────
  const scoredSections = useQuery(api.personas.getRankedSectionsByScore, { userId });
  const persona       = useQuery(api.personas.getPersona, { userId });
  const seedDemoData  = useMutation(api.seed.seedDemoData);

  // ── Local UI state ───────────────────────────────────────────────────────
  const [order, setOrder] = useState<string[]>(DEFAULT_ORDER);
  const [aiToastMessage, setAiToastMessage] = useState<string | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isLearning, setIsLearning] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const prevTopRef = useRef<string | null>(null);
  const hasHydratedRef = useRef(false);
  const latestServerOrderRef = useRef<string[]>(DEFAULT_ORDER);

  // ── Auto-seed on first login ─────────────────────────────────────────────
  useEffect(() => {
    if (persona === null && !hasHydratedRef.current) {
      seedDemoData({ userId }).catch(() => {});
    }
  }, [persona, userId, seedDemoData]);

  // ── Narration helper ─────────────────────────────────────────────────────
  const fireNarration = useCallback(
    async (prevSection: string, newSection: string) => {
      if (isNarrating) return;

      const optimisticMsg = `${SECTION_LABELS[newSection] ?? newSection} promoted based on live signals.`;
      setAiToastMessage(optimisticMsg);

      toast.success("Intelligence Adapted", {
        description: optimisticMsg,
        icon: <Sparkles size={14} className="text-[#0071e3]" />,
        duration: 4000,
      });

      setIsNarrating(true);
      try {
        const res = await fetch("/api/narrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            persona: persona?.type ?? "Explorer",
            topSection: SECTION_LABELS[newSection] ?? newSection,
            previousTop: SECTION_LABELS[prevSection] ?? prevSection,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.narration) setAiToastMessage(data.narration);
        }
      } catch {
      } finally {
        setIsNarrating(false);
      }
    },
    [persona, isNarrating]
  );

  // ── Handle incoming server order ─────────────────────────────────────────
  useEffect(() => {
    if (!scoredSections || scoredSections.length === 0) return;

    latestServerOrderRef.current = scoredSections.slice(0, 4);

    if (!hasHydratedRef.current) {
      hasHydratedRef.current = true;
      prevTopRef.current = scoredSections[0];
      setOrder(scoredSections.slice(0, 4));
    }
  }, [scoredSections]);

  // ── Instant Sync Engine ──────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const serverOrder = latestServerOrderRef.current;
      if (!serverOrder || serverOrder.length === 0) return;

      const serverTop = serverOrder[0];
      const localTop = order[0];

      if (serverTop !== localTop) {
        setIsLearning(true);
        setTimeout(() => {
          setIsLearning(false);
          setOrder(serverOrder);
          if (prevTopRef.current !== serverTop) {
            fireNarration(localTop, serverTop);
            prevTopRef.current = serverTop;
          }
        }, 1500); // Pulse for 1.5s then morph
      }
    };

    const interval = setInterval(tick, SCORE_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [order, fireNarration]);


  // ── Manual drag handler ──────────────────────────────────────────────────
  const handleManualReorder = useCallback(
    (newOrder: string[]) => {
      const prevTop = order[0];
      const newTop = newOrder[0];
      setOrder(newOrder);
      if (newTop !== prevTop) {
        prevTopRef.current = newTop;
        fireNarration(prevTop, newTop);
      }
    },
    [order, fireNarration]
  );

  // ── Render ───────────────────────────────────────────────────────────────
  const isLoading = scoredSections === undefined;

  return (
    <div>
      {/* AI narration overlay toast */}
      <AnimatePresence>
        {aiToastMessage && (
          <AIToast message={aiToastMessage} onDismiss={() => setAiToastMessage(null)} />
        )}
      </AnimatePresence>

      {/* Confusion modal */}
      <AnimatePresence>
        {isConfused && <ConfusionAlert onDismiss={dismiss} />}
      </AnimatePresence>

      {/* Learning indicator */}
      <AnimatePresence>
        {isLearning && <LearningBadge />}
      </AnimatePresence>

      {/* Loading skeletons */}
      {isLoading && (
        <div>
          {DEFAULT_ORDER.map((id, i) => (
            <SectionSkeleton key={id} index={i} />
          ))}
        </div>
      )}

      {/* Live reorderable grid */}
      {!isLoading && (
        <Reorder.Group
          axis="y"
          values={order}
          onReorder={handleManualReorder}
          style={{ listStyle: "none", padding: 0, margin: 0 }}
        >
          {order.map((sectionId, index) => {
            const Component = SECTION_MAP[sectionId];
            if (!Component) return null;
            const isTop = index === 0;

            return (
              <Reorder.Item
                key={sectionId}
                value={sectionId}
                style={{ marginBottom: "14px" }}
                whileDrag={{
                  scale: 1.012,
                  boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
                  zIndex: 20,
                  borderRadius: 20,
                }}
                onMouseEnter={() => setHoveredSection(sectionId)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <motion.div
                  layout
                  layoutId={`card-${sectionId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    layout: { type: "spring", stiffness: 340, damping: 32 },
                    opacity: { duration: 0.22 },
                    y: { type: "spring", stiffness: 400, damping: 38, delay: index * 0.04 },
                  }}
                  className={`bento-card${isTop ? " bento-card--priority" : ""}`}
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  {/* Priority accent strip */}
                  <AnimatePresence>
                    {isTop && (
                      <motion.div
                        key="priority-strip"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{
                          position: "absolute",
                          top: 0, left: 0, right: 0,
                          height: "2px",
                          background: "linear-gradient(90deg, #0071e3 0%, #2997ff 60%, transparent 100%)",
                          transformOrigin: "left",
                          borderRadius: "1px",
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* "TOP PRIORITY" badge */}
                  {isTop && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 25 }}
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 36,
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "#2997ff",
                        background: "rgba(0,113,227,0.12)",
                        border: "0.5px solid rgba(0,113,227,0.28)",
                        padding: "2px 8px",
                        borderRadius: "980px",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        zIndex: 2,
                      }}
                    >
                      ● Top Priority
                    </motion.div>
                  )}

                  {/* Drag handle on hover */}
                  <AnimatePresence>
                    {hoveredSection === sectionId && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: 12,
                          transform: "translateY(-50%)",
                          color: "rgba(var(--fg-rgb),0.16)",
                          cursor: "grab",
                          zIndex: 2,
                          pointerEvents: "none",
                        }}
                      >
                        <GripVertical size={15} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Component userId={userId} isTop={isTop} />
                </motion.div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}
    </div>
  );
}
