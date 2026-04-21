"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Clock, CheckCircle2, Bell, UserPlus, Cpu, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { getNotifications, markAllNotificationsRead, clearNotifications } from "@/app/actions/notifications";
import { useRouter } from "next/navigation";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onReadAction: () => void;
}

const TYPE_MAP: Record<string, { icon: any; color: string; bg: string }> = {
  NEW_LEAD:  { icon: UserPlus,     color: "var(--accent-green)",  bg: "var(--accent-green-dim)" },
  TASK_DUE:  { icon: Clock,        color: "var(--primary)",       bg: "var(--primary-dim)" },
  ALERT:     { icon: AlertCircle,  color: "var(--accent-red)",    bg: "var(--accent-red-dim)" },
  AI_ACTION: { icon: Cpu,          color: "var(--accent-purple)", bg: "var(--accent-purple-dim)" },
  DEFAULT:   { icon: Bell,         color: "var(--accent-blue)",   bg: "var(--accent-blue-dim)" },
};

function getTypeConfig(type: string) {
  return TYPE_MAP[type] ?? TYPE_MAP.DEFAULT;
}

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function NotificationDrawer({ isOpen, onClose, onReadAction }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) loadNotifications();
  }, [isOpen]);

  const loadNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    await loadNotifications();
    onReadAction();
  };

  const handleClear = async () => {
    await clearNotifications();
    await loadNotifications();
    onReadAction();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(6px)",
              zIndex: 100,
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            style={{
              position: "fixed", top: 0, right: 0,
              height: "100%", width: "400px",
              background: "var(--surface)",
              borderLeft: "1px solid var(--border)",
              zIndex: 101,
              display: "flex", flexDirection: "column",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "1.5rem 1.75rem",
              borderBottom: "1px solid var(--border)",
            }}>
              <div>
                <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>
                  Alerts
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <h2 style={{ fontSize: "1.125rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>
                    Intelligence Center
                  </h2>
                  {unreadCount > 0 && (
                    <span style={{
                      padding: "2px 8px", borderRadius: "var(--radius-full)",
                      background: "var(--accent-red-dim)", color: "var(--accent-red)",
                      fontSize: "0.6875rem", fontWeight: 800,
                    }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: "34px", height: "34px",
                  borderRadius: "9px",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--foreground-muted)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                className="hover-bright"
              >
                <X size={16} />
              </button>
            </div>

            {/* Action buttons */}
            {notifications.length > 0 && (
              <div style={{ display: "flex", gap: "0.625rem", padding: "1rem 1.75rem", borderBottom: "1px solid var(--border)" }}>
                <button
                  onClick={handleMarkAllRead}
                  className="btn btn-ghost"
                  style={{ flex: 1, justifyContent: "center", fontSize: "0.75rem" }}
                >
                  Mark All Read
                </button>
                <button
                  onClick={handleClear}
                  className="btn btn-ghost"
                  style={{ flex: 1, justifyContent: "center", fontSize: "0.75rem", color: "var(--foreground-subtle)" }}
                >
                  Clear Read
                </button>
              </div>
            )}

            {/* Notification List */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {notifications.length > 0 ? notifications.map((notif, i) => {
                const cfg = getTypeConfig(notif.type);
                const Icon = cfg.icon;
                const isUnread = !notif.isRead;

                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => { if (notif.link) { router.push(notif.link); onClose(); } }}
                    style={{
                      display: "flex",
                      gap: "0.875rem",
                      padding: "1rem 1.125rem",
                      borderRadius: "14px",
                      background: isUnread ? "var(--surface-2)" : "transparent",
                      border: `1px solid ${isUnread ? "var(--border-medium)" : "var(--border)"}`,
                      borderLeft: `3px solid ${isUnread ? cfg.color : "var(--border)"}`,
                      cursor: notif.link ? "pointer" : "default",
                      opacity: isUnread ? 1 : 0.55,
                      transition: "all 0.15s ease",
                    }}
                    className={notif.link ? "interactive-row" : ""}
                  >
                    {/* Icon */}
                    <div style={{
                      width: "34px", height: "34px",
                      borderRadius: "9px",
                      background: cfg.bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "1px",
                    }}>
                      <Icon size={15} color={cfg.color} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: "0.8125rem",
                        fontWeight: isUnread ? 700 : 600,
                        color: isUnread ? "var(--foreground)" : "var(--foreground-muted)",
                        marginBottom: "0.25rem",
                        lineHeight: 1.3,
                      }}>
                        {notif.title}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--foreground-subtle)", lineHeight: 1.4 }}>
                        {notif.message}
                      </div>
                      <div style={{ fontSize: "0.625rem", color: "var(--foreground-subtle)", marginTop: "0.5rem", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                        {timeAgo(notif.createdAt)}
                      </div>
                    </div>

                    {/* Unread indicator */}
                    {isUnread && (
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.color, flexShrink: 0, marginTop: "4px", boxShadow: `0 0 5px ${cfg.color}` }} />
                    )}
                  </motion.div>
                );
              }) : (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 1rem", gap: "1rem", textAlign: "center" }}>
                  <div style={{
                    width: "52px", height: "52px",
                    borderRadius: "50%",
                    background: "var(--accent-green-dim)",
                    border: "1px solid rgba(34,211,163,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <CheckCircle2 size={24} color="var(--accent-green)" />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--foreground)" }}>You're all clear</div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--foreground-subtle)", marginTop: "0.375rem" }}>No alerts in your pipeline right now.</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
