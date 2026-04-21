"use client";

import { Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface MonthlySentimentProps {
  avgCsat: number;
}

export default function MonthlySentiment({ avgCsat }: MonthlySentimentProps) {
  const pct = (avgCsat / 5) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="premium-card"
      style={{ padding: "1.5rem" }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "11px",
          background: "var(--primary-dim)",
          border: "1px solid rgba(245,200,66,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Star size={18} color="var(--primary)" fill="var(--primary)" />
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: "3px",
          padding: "3px 8px", borderRadius: "6px",
          background: "var(--accent-green-dim)",
          color: "var(--accent-green)",
          fontSize: "0.6875rem", fontWeight: 700,
        }}>
          <TrendingUp size={11} />
          +5%
        </div>
      </div>

      {/* Label */}
      <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.375rem" }}>
        Partnership Sentiment
      </div>

      {/* Score */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem", marginBottom: "1rem" }}>
        <span style={{ fontSize: "1.875rem", fontWeight: 900, fontFamily: "var(--font-display)", letterSpacing: "-0.03em", color: "var(--foreground)" }}>
          {avgCsat.toFixed(1)}
        </span>
        <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--foreground-subtle)" }}>/ 5.0</span>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: "5px" }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} style={{
            flex: 1,
            height: "5px",
            borderRadius: "var(--radius-full)",
            background: s <= Math.round(avgCsat) ? "var(--primary)" : "var(--border)",
            transition: "background 0.3s ease",
            boxShadow: s <= Math.round(avgCsat) ? "0 0 6px var(--primary-glow)" : "none",
          }} />
        ))}
      </div>
    </motion.div>
  );
}
