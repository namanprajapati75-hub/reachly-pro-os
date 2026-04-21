"use client";

import { FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ReportsDueWidgetProps {
  draftCount: number;
}

export default function ReportsDueWidget({ draftCount }: ReportsDueWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="premium-card"
      style={{ padding: "1.5rem" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "11px",
          background: "var(--primary-dim)",
          border: "1px solid rgba(245,200,66,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <FileText size={18} color="var(--primary)" />
        </div>
        {draftCount > 0 && (
          <span style={{
            padding: "3px 8px", borderRadius: "6px",
            background: "var(--accent-red-dim)", color: "var(--accent-red)",
            fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.06em",
          }}>
            {draftCount} PENDING
          </span>
        )}
      </div>

      <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.375rem" }}>
        Report Queue
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem", marginBottom: "1rem" }}>
        <span style={{ fontSize: "1.875rem", fontWeight: 900, fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
          {draftCount}
        </span>
        <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--foreground-subtle)" }}>drafts</span>
      </div>

      <Link href="/reports">
        <div style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)" }} className="hover-bright">
          Review Reports <ChevronRight size={13} />
        </div>
      </Link>
    </motion.div>
  );
}
