"use client";

import { Zap, Building2, ChevronRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface PriorityTask {
  id: string;
  title: string;
  priority: string;
  client?: { name: string } | null;
  dueDate: string | null;
}

interface TodayPrioritiesWidgetProps {
  tasks: PriorityTask[];
}

const PRIORITY_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
  Urgent: { color: "var(--accent-red)", bg: "var(--accent-red-dim)", dot: "danger" },
  High:   { color: "var(--accent-orange)", bg: "var(--accent-orange-dim)", dot: "warning" },
  Medium: { color: "var(--primary)", bg: "var(--primary-dim)", dot: "live" },
};

export default function TodayPrioritiesWidget({ tasks }: TodayPrioritiesWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="premium-card"
      style={{ padding: "1.75rem", display: "flex", flexDirection: "column" }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>
            Priorities
          </div>
          <div style={{ fontSize: "1.125rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>
            Critical Actions
          </div>
        </div>
        <Link href="/tasks">
          <div style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)" }} className="hover-bright">
            All Tasks <ChevronRight size={14} />
          </div>
        </Link>
      </div>

      {/* Task List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", flex: 1 }}>
        {tasks.length > 0 ? tasks.map((task, i) => {
          const cfg = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.Medium;
          const formattedDate = task.dueDate
            ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            : null;

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="interactive-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.875rem",
                borderRadius: "12px",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderLeft: `3px solid ${cfg.color}`,
              }}
            >
              {/* Dot */}
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: cfg.color, flexShrink: 0, boxShadow: `0 0 6px ${cfg.color}` }} />

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {task.title}
                </div>
                {task.client && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.6875rem", color: "var(--foreground-subtle)", marginTop: "2px" }}>
                    <Building2 size={10} />
                    {task.client.name}
                  </div>
                )}
              </div>

              {/* Right */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px", flexShrink: 0 }}>
                <span style={{
                  fontSize: "0.5625rem", fontWeight: 800, padding: "2px 7px", borderRadius: "5px",
                  background: cfg.bg, color: cfg.color, letterSpacing: "0.08em", textTransform: "uppercase",
                }}>
                  {task.priority}
                </span>
                {formattedDate && (
                  <span style={{ fontSize: "0.625rem", color: "var(--foreground-subtle)" }}>{formattedDate}</span>
                )}
              </div>
            </motion.div>
          );
        }) : (
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            gap: "0.75rem",
            border: "1px dashed var(--border)",
            borderRadius: "12px",
            textAlign: "center",
          }}>
            <Zap size={28} color="var(--foreground-subtle)" strokeWidth={1.5} />
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground-muted)" }}>All clear!</div>
              <div style={{ fontSize: "0.75rem", color: "var(--foreground-subtle)", marginTop: "2px" }}>No critical tasks today.</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
