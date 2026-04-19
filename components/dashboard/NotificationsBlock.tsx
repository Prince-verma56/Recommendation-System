"use client";

import { motion } from "framer-motion";
import { Bell, CheckCircle2, FileText, UserPlus } from "lucide-react";

interface Notification {
  id: number;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  time: string;
  unread: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    icon: <FileText size={14} />,
    iconBg: "#0071e3",
    title: "Document Review Request",
    subtitle: "Sarah Chen sent you a contract for review.",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    icon: <UserPlus size={14} />,
    iconBg: "#30d158",
    title: "New Collaborator Added",
    subtitle: "Alex joined your workspace.",
    time: "18m ago",
    unread: true,
  },
  {
    id: 3,
    icon: <CheckCircle2 size={14} />,
    iconBg: "#bf5af2",
    title: "Task Completed",
    subtitle: "Q2 report was automatically filed.",
    time: "1h ago",
    unread: false,
  },
];

export function NotificationsBlock({ isTop }: { userId: string; isTop?: boolean }) {
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <div className="stat-label">Notifications</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>Inbox</h3>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  background: "#0071e3",
                  color: "var(--text-primary)",
                  fontSize: "10px",
                  fontWeight: 700,
                  borderRadius: "980px",
                  padding: "2px 7px",
                  lineHeight: 1.4,
                }}
              >
                {unreadCount}
              </motion.span>
            )}
          </div>
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#0071e3", fontSize: "13px", fontWeight: 600 }}>
          Mark all read
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {NOTIFICATIONS.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ backgroundColor: "rgba(var(--fg-rgb),0.04)" }}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "12px 14px",
              background: n.unread ? "rgba(0,113,227,0.06)" : "rgba(var(--fg-rgb),0.02)",
              border: `0.5px solid ${n.unread ? "rgba(0,113,227,0.14)" : "rgba(var(--fg-rgb),0.05)"}`,
              borderRadius: "14px",
              cursor: "pointer",
              transition: "background 0.2s",
              position: "relative",
            }}
          >
            {/* Unread dot */}
            {n.unread && (
              <motion.div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 14,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#0071e3",
                }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Icon */}
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "10px",
              background: n.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "var(--text-primary)",
            }}>
              {n.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: n.unread ? 600 : 400, color: "var(--text-primary)", marginBottom: "2px" }}>
                {n.title}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-tertiary)", lineHeight: 1.45, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {n.subtitle}
              </div>
            </div>

            <div style={{ fontSize: "11px", color: "var(--text-tertiary)", flexShrink: 0, marginTop: "1px" }}>
              {n.time}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


