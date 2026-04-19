"use client";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export function PersonaSwitcher() {
  const { user } = useUser();
  const setOverride = useMutation(api.preferences.setPersonaOverride);
  const prefs = useQuery(
    api.preferences.getPreferences,
    user?.id ? { userId: user.id } : "skip"
  );

  const personas = [
    { id: null, label: "AI Decides", desc: "Fully autonomous. Best experience.", color: "#0071e3" },
    { id: "Explorer", label: "Explorer", desc: "Balanced sections. Discovery-first.", color: "#30d158" },
    { id: "Quick Scanner", label: "Quick Scanner", desc: "Big numbers front. Dense tables hidden.", color: "#ff9f0a" },
    { id: "Power User", label: "Power User", desc: "All data visible. Maximum density.", color: "#bf5af2" },
  ];

  const handleSelect = async (personaId: string | null) => {
    if (!user?.id) return;
    await setOverride({ userId: user.id, personaOverride: personaId ?? undefined });
  };

  return (
    <div className="persona-grid">
      {personas.map((p) => {
        const isActive = prefs?.personaOverride === p.id ||
          (p.id === null && !prefs?.personaOverride);
        return (
          <button
            key={p.label}
            onClick={() => handleSelect(p.id)}
            style={{
              background: isActive ? `${p.color}12` : "var(--bg-tertiary)",
              border: `0.5px solid ${isActive ? `${p.color}30` : "rgba(var(--fg-rgb),0.06)"}`,
              borderRadius: "14px",
              padding: "16px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.2s",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {isActive && (
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: "2px",
                background: `linear-gradient(90deg, ${p.color}, transparent)`,
              }} />
            )}
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              marginBottom: "6px",
            }}>
              <span style={{
                fontSize: "13px", fontWeight: 600,
                color: isActive ? p.color : "var(--text-primary)",
                letterSpacing: "-0.01em",
              }}>
                {p.label}
              </span>
              {isActive && (
                <span style={{
                  fontSize: "9px", fontWeight: 700,
                  color: "#30d158",
                  background: "rgba(48,209,88,0.12)",
                  border: "0.5px solid rgba(48,209,88,0.25)",
                  padding: "2px 7px",
                  borderRadius: "980px",
                  letterSpacing: "0.5px",
                }}>
                  ● Active
                </span>
              )}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-tertiary)", lineHeight: 1.5 }}>
              {p.desc}
            </div>
          </button>
        );
      })}
    </div>
  );
}
