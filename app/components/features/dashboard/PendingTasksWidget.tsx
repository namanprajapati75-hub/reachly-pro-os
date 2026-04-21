"use client";

import { motion } from "framer-motion";
import { CheckSquare, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

interface PendingTasksWidgetProps {
  count: number;
}

export default function PendingTasksWidget({ count }: PendingTasksWidgetProps) {
  const urgency = count > 10 ? "critical" : count > 5 ? "high" : "clear";

  const urgencyConfig = {
    critical: { color: "var(--accent-red)", bg: "var(--accent-red-dim)", label: "Critical" },
    high:     { color: "var(--accent-orange)", bg: "var(--accent-orange-dim)", label: "High Load" },
    clear:    { color: "var(--accent-green)", bg: "var(--accent-green-dim)", label: "On Track" },
  };

  const cfg = urgencyConfig[urgency];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="premium-card"
      style={{ padding: "1.75rem" }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
        <div>
          <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem" }}>
            Tasks
          </div>
          <div style={{ fontSize: "1.125rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>
            Pending Actions
          </div>
        </div>
        <div style={{
          padding: "3px 10px",
          borderRadius: "6px",
          background: cfg.bg,
          color: cfg.color,
          fontSize: "0.6875rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
        }}>
          {cfg.label}
        </div>
      </div>

      {/* Big Count */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", padding: "1.5rem", borderRadius: "14px", background: "var(--surface-2)", border: "1px solid var(--border)", marginBottom: "1.25rem" }}>
        <div style={{
          width: "56px", height: "56px",
          borderRadius: "14px",
          background: cfg.bg,
          border: `1px solid ${cfg.color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <CheckSquare size={24} color={cfg.color} />
        </div>
        <div>
          <div style={{ fontSize: "2.5rem", fontWeight: 900, fontFamily: "var(--font-display)", letterSpacing: "-0.04em", color: "var(--foreground)", lineHeight: 1 }}>
            {count}
          </div>
          <div style={{ fontSize: "0.8125rem", color: "var(--foreground-muted)", marginTop: "0.25rem" }}>
            tasks need your attention
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
        {[
          { label: "Overdue", value: Math.max(0, Math.floor(count * 0.2)), color: "var(--accent-red)" },
          { label: "Due Today", value: Math.max(0, Math.floor(count * 0.4)), color: "var(--accent-orange)" },
          { label: "Upcoming", value: Math.max(0, Math.floor(count * 0.4)), color: "var(--foreground-muted)" },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: "0.8125rem", color: "var(--foreground-muted)" }}>{item.label}</span>
            </div>
            <span style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--foreground)", fontFamily: "var(--font-display)" }}>{item.value}</span>
          </div>
        ))}
      </div>

      <Link href="/tasks">
        <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
          <Clock size={14} />
          View All Tasks
          <ArrowRight size={13} />
        </button>
      </Link>
    </motion.div>
  );
}
