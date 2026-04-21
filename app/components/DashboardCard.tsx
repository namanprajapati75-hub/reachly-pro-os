"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: ReactNode;
  delay?: number;
  accent?: string;
  subtitle?: string;
  progress?: number;
}

export default function DashboardCard({
  title,
  value,
  change,
  isPositive,
  icon,
  delay = 0,
  accent = 'var(--primary)',
  subtitle,
  progress = 70,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="premium-card"
      style={{ padding: '1.5rem', minWidth: '0', cursor: 'default' }}
    >
      {/* Top Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        {/* Icon */}
        <div style={{
          width: '40px', height: '40px',
          borderRadius: '11px',
          background: `${accent}18`,
          border: `1px solid ${accent}28`,
          color: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>

        {/* Change Badge */}
        {change && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            padding: '3px 8px',
            borderRadius: '6px',
            background: isPositive ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)',
            color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
            fontSize: '0.6875rem',
            fontWeight: 700,
          }}>
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {change}
          </div>
        )}
      </div>

      {/* Value */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.875rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--foreground)' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)', marginTop: '0.25rem' }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, delay: delay + 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{ background: `linear-gradient(90deg, ${accent}aa, ${accent})` }}
        />
      </div>
    </motion.div>
  );
}
