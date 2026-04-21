"use client";

import { AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface AtRiskLeadWidgetProps {
  count: number;
}

export default function AtRiskLeadWidget({ count }: AtRiskLeadWidgetProps) {
  const hasRisk = count > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="premium-card"
      style={{
        padding: "1.5rem",
        border: `1px solid ${hasRisk ? "rgba(240,82,82,0.25)" : "var(--border)"}`,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
        <div style={{
          width: "40px", height: "40px",
          borderRadius: "11px",
          background: hasRisk ? "var(--accent-red-dim)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${hasRisk ? "rgba(240,82,82,0.2)" : "var(--border)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <AlertCircle size={18} color={hasRisk ? "var(--accent-red)" : "var(--foreground-subtle)"} />
        </div>
        {hasRisk && (
          <span style={{
            padding: "3px 8px", borderRadius: "6px",
            background: "var(--accent-red-dim)",
            color: "var(--accent-red)",
            fontSize: "0.6875rem", fontWeight: 800,
            letterSpacing: "0.06em",
          }}>
            ACTION NEEDED
          </span>
        )}
      </div>

      {/* Label */}
      <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.375rem" }}>
        Lifecycle Alert
      </div>

      {/* Count */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "1rem" }}>
        <span style={{
          fontSize: "1.875rem", fontWeight: 900,
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.03em",
          color: hasRisk ? "var(--accent-red)" : "var(--foreground)",
        }}>
          {count}
        </span>
        <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--foreground-subtle)" }}>
          leads at risk
        </span>
      </div>

      {/* Progress bar (full red = all at risk) */}
      <div className="progress-bar" style={{ marginBottom: "0.75rem" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: hasRisk ? "100%" : "0%" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            height: "100%", borderRadius: "var(--radius-full)",
            background: hasRisk ? "var(--accent-red)" : "var(--accent-green)",
          }}
        />
      </div>

      <Link href="/ai-hub">
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: "0.75rem", fontWeight: 700,
          color: hasRisk ? "var(--accent-red)" : "var(--foreground-subtle)",
          cursor: "pointer",
          transition: "opacity 0.15s",
        }} className="hover-bright">
          {hasRisk ? "Recover in AI Hub" : "All leads healthy"}
          <ArrowRight size={13} />
        </div>
      </Link>
    </motion.div>
  );
}
