"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, BarChart2, User } from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={13} /> },
  { path: "/analytics", label: "Analytics",  icon: <BarChart2 size={13} /> },
  { path: "/profile",   label: "Profile",    icon: <User size={13} /> },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const persona = useQuery(api.personas.getPersona, { userId: user?.id ?? "" });
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav
      className="apple-glass"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        gap: "12px",
      }}
    >
      {/* ── Logo ─────────────────────────────────────── */}
      <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", flexShrink: 0 }}>
        <motion.div
          style={{
            width: 26, height: 26, borderRadius: "8px",
            background: "linear-gradient(135deg, #0071e3, #2997ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px",
            boxShadow: "0 0 10px rgba(0,113,227,0.4)",
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          P
        </motion.div>
        <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.4px" }}>
          PersonaUI
        </span>
      </Link>

      {/* ── Nav Pills ─────────────────────────────────── */}
      <div className="navbar-links">
        {NAV_LINKS.map(({ path, label, icon }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={path}
              href={path}
              onMouseEnter={() => setHovered(path)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 14px",
                borderRadius: "980px",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#fff" : hovered === path ? "rgba(var(--fg-rgb),0.8)" : "rgba(var(--fg-rgb),0.5)",
                textDecoration: "none",
                transition: "color 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  style={{
                    position: "absolute", inset: 0, borderRadius: "980px",
                    background: "rgba(var(--fg-rgb),0.1)",
                    border: "0.5px solid rgba(var(--fg-rgb),0.1)",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center" }}>
                {icon}
              </span>
              <span className="navbar-label" style={{ position: "relative", zIndex: 1 }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ── Right — Persona + UserButton ─────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <AnimatePresence>
          <motion.div
            key={persona?.type ?? "learning"}
            initial={{ opacity: 0, scale: 0.85, x: 8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            style={{
              fontSize: "11px", fontWeight: 600,
              background: "rgba(0,113,227,0.15)",
              color: "#2997ff",
              padding: "4px 12px",
              borderRadius: "980px",
              border: "0.5px solid rgba(0,113,227,0.3)",
              letterSpacing: "0.3px",
              userSelect: "none",
              display: "flex", alignItems: "center", gap: "5px",
            }}
          >
            <motion.div
              style={{ width: 5, height: 5, borderRadius: "50%", background: "#0071e3" }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>{persona?.type ?? "Learning..."}</span>
          </motion.div>
        </AnimatePresence>

        <ThemeToggle />

        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                width: "28px", height: "28px",
                borderRadius: "50%",
                border: "1.5px solid rgba(var(--fg-rgb),0.15)",
              },
            },
          }}
        />
      </div>
    </nav>
  );
}


