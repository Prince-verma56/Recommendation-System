"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useConfusionDetect } from "@/hooks/useConfusionDetect";
import { useTracker } from "@/hooks/useTracker";

// Widget section components
import { StatsBlock as StatsSection } from "./StatsBlock";
import { ActivityBarChart as ActivitySection } from "./ActivityBarChart";
import { TimePredictionCard as OracleSection } from "./TimePredictionCard";
import { NotificationsBlock as NotificationsSection } from "./NotificationsBlock";
import { ConfusionAlert } from "./ConfusionAlert";
import { AIToast } from "@/components/ui/AIToast";

// ── Types ──────────────────────────────────────────────────────────────────
const SECTION_MAP: Record<
  string,
  React.ComponentType<{ userId: string; isTop: boolean }>
> = {
  stats: StatsSection,
  activity: ActivitySection,
  oracle: OracleSection,
  notifications: NotificationsSection,
};

const DEFAULT_ORDER = ["stats", "activity", "oracle", "notifications"];

// Section-label map for readable narration prompts
const SECTION_LABELS: Record<string, string> = {
  stats: "Your Metrics",
  activity: "Activity Feed",
  oracle: "Time Oracle",
  notifications: "Notifications",
};

// ── Loading skeleton ───────────────────────────────────────────────────────
function SectionSkeleton() {
  return (
    <div
      style={{
        height: 140,
        borderRadius: 20,
        background: "var(--bg-secondary)",
        border: "0.5px solid var(--border)",
        marginBottom: 16,
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
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export function PersonalizedGrid({ userId }: { userId: string }) {
  // Track the dashboard section itself
  useTracker({ section: "dashboard" });

  const { user } = useUser();
  const currentHour = new Date().getHours();

  // Live ranked order from Convex (undefined = loading)
  const rankedSections = useQuery(api.personas.getRankedSections, {
    userId,
    hour: currentHour,
  });

  // Live persona for narration context
  const persona = useQuery(api.personas.getPersona, { userId });

  // ── Local state ──────────────────────────────────────────────────────────
  const [sections, setSections] = useState<string[]>(DEFAULT_ORDER);
  const [toast, setToast] = useState<string | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);

  // Track the previous top section so we fire narration only on genuine changes
  const prevTopRef = useRef<string | null>(null);
  // Guard: don't narrate on the initial mount hydration
  const hasHydratedRef = useRef(false);

  const { isConfused, dismiss } = useConfusionDetect({ idleThresholdMs: 22000, scrollThreshold: 3 });

  // ── Narration call ───────────────────────────────────────────────────────
  const fireNarration = useCallback(
    async (prevSection: string, newSection: string) => {
      if (isNarrating) return;
      setIsNarrating(true);
      try {
        const avgDwellSec = Math.round((persona?.dwellAvg ?? 0) / 1000);
        const res = await fetch("/api/narrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            persona: persona?.type ?? "Explorer",
            topSection: SECTION_LABELS[newSection] ?? newSection,
            previousTop: SECTION_LABELS[prevSection] ?? prevSection,
            reason: `User spent avg ${avgDwellSec}s per session, most interactions at hour ${currentHour}`,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.narration) setToast(data.narration);
        }
      } catch {
        // Fallback toast – never leave the user without feedback
        setToast(
          `${SECTION_LABELS[newSection] ?? newSection} moved up based on your session patterns.`
        );
      } finally {
        setIsNarrating(false);
      }
    },
    [persona, currentHour, isNarrating]
  );

  // ── Sync Convex → local order with change detection ─────────────────────
  useEffect(() => {
    if (!rankedSections || rankedSections.length === 0) return;

    const newTop = rankedSections[0];
    const prevTop = prevTopRef.current;

    // On first real data arrival, just hydrate — don't narrate
    if (!hasHydratedRef.current) {
      hasHydratedRef.current = true;
      prevTopRef.current = newTop;
      setSections(rankedSections.slice(0, 4));
      return;
    }

    // Only act when the ranked order actually changed
    const currentKey = sections.join(",");
    const incomingKey = rankedSections.slice(0, 4).join(",");
    if (currentKey === incomingKey) return;

    setSections(rankedSections.slice(0, 4));

    // Fire narration only when the TOP section changed
    if (prevTop !== null && newTop !== prevTop) {
      fireNarration(prevTop, newTop);
    }

    prevTopRef.current = newTop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankedSections?.join(",")]);

  // ── Manual drag handler ──────────────────────────────────────────────────
  const handleManualReorder = useCallback(
    (newOrder: string[]) => {
      const prevTop = sections[0];
      const newTop = newOrder[0];
      setSections(newOrder);
      if (newTop !== prevTop) {
        prevTopRef.current = newTop;
        fireNarration(prevTop, newTop);
      }
    },
    [sections, fireNarration]
  );

  // ── Render ───────────────────────────────────────────────────────────────
  const isLoading = rankedSections === undefined;

  return (
    <div style={{ padding: "0 0 40px" }}>
      {/* AI Narration Toast */}
      <AnimatePresence>
        {toast && <AIToast message={toast} onDismiss={() => setToast(null)} />}
      </AnimatePresence>

      {/* Confusion Help Modal */}
      <AnimatePresence>
        {isConfused && <ConfusionAlert onDismiss={dismiss} />}
      </AnimatePresence>

      {/* Loading state — 4 skeletons */}
      {isLoading && (
        <div>
          {DEFAULT_ORDER.map((id) => (
            <SectionSkeleton key={id} />
          ))}
        </div>
      )}

      {/* Live reorderable grid */}
      {!isLoading && (
        <Reorder.Group
          axis="y"
          values={sections}
          onReorder={handleManualReorder}
          style={{ listStyle: "none", padding: 0, margin: 0 }}
        >
          {sections.map((sectionId, index) => {
            const Component = SECTION_MAP[sectionId];
            if (!Component) return null;

            return (
              <Reorder.Item
                key={sectionId}
                value={sectionId}
                style={{ marginBottom: "16px", cursor: "grab" }}
                whileDrag={{
                  scale: 1.015,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                  zIndex: 10,
                  cursor: "grabbing",
                }}
              >
                <motion.div
                  layout
                  layoutId={sectionId}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    layout: { type: "spring", stiffness: 340, damping: 32 },
                    opacity: { duration: 0.25 },
                    y: { type: "spring", stiffness: 380, damping: 36, delay: index * 0.05 },
                  }}
                  className={`bento-card${index === 0 ? " bento-card--priority" : ""}`}
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  {/* Priority glow strip on the top widget */}
                  {index === 0 && (
                    <motion.div
                      layoutId="priority-strip"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background:
                          "linear-gradient(90deg, #0071e3, #2997ff, transparent)",
                        borderRadius: "1px",
                      }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  )}

                  <Component userId={userId} isTop={index === 0} />
                </motion.div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}
    </div>
  );
}
