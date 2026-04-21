"use client";

import { Flame, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface HotLead {
  id: string;
  name: string;
  aiScore: number;
}

interface HotOpportunitiesWidgetProps {
  leads: HotLead[];
}

function getScoreColor(score: number) {
  if (score >= 90) return "var(--accent-red)";
  if (score >= 80) return "var(--accent-orange)";
  return "var(--primary)";
}

export default function HotOpportunitiesWidget({ leads }: HotOpportunitiesWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="premium-card"
      style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <Flame size={18} color="var(--accent-red)" />
          <div>
            <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              AI Detected
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>
              Hot Opportunities
            </div>
          </div>
        </div>
        <Link href="/ai-hub">
          <div style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)" }} className="hover-bright">
            Smart Inbox <ChevronRight size={13} />
          </div>
        </Link>
      </div>

      {/* Lead list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {leads.length > 0 ? leads.map((lead, i) => {
          const scoreColor = getScoreColor(lead.aiScore);
          return (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="interactive-row"
              style={{
                display: "flex", alignItems: "center", gap: "0.875rem",
                padding: "0.875rem 1rem",
                borderRadius: "12px",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Score Badge */}
              <div style={{
                width: "40px", height: "40px",
                borderRadius: "11px",
                background: `${scoreColor}18`,
                border: `1px solid ${scoreColor}28`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: 900, color: scoreColor, fontFamily: "var(--font-display)" }}>
                  {lead.aiScore}
                </span>
              </div>

              {/* Name + description */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {lead.name}
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--foreground-subtle)", marginTop: "2px" }}>
                  High-probability conversion
                </div>
              </div>

              {/* Action indicator */}
              <div style={{
                padding: "3px 8px",
                borderRadius: "6px",
                background: "var(--accent-green-dim)",
                color: "var(--accent-green)",
                fontSize: "0.5625rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                flexShrink: 0,
              }}>
                ACT NOW
              </div>
            </motion.div>
          );
        }) : (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: "2rem", gap: "0.75rem",
            border: "1px dashed var(--border)", borderRadius: "12px",
            textAlign: "center",
          }}>
            <Zap size={24} color="var(--foreground-subtle)" strokeWidth={1.5} />
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground-muted)" }}>AI scanning…</div>
              <div style={{ fontSize: "0.75rem", color: "var(--foreground-subtle)", marginTop: "2px" }}>No hot leads identified today.</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
