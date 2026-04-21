"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, Calendar, DollarSign, MessageSquare, PhoneCall, UserPlus, ArrowUpRight } from "lucide-react";

interface GrowthMetric {
  label: string;
  value: string;
  target: string;
  progress: number;
  change: string;
  isPositive: boolean;
  icon: typeof Target;
  color: string;
  bg: string;
}

const METRICS: GrowthMetric[] = [
  {
    label: 'Leads Added',
    value: '0',
    target: '/ 80 goal',
    progress: 0,
    change: '+0',
    isPositive: true,
    icon: UserPlus,
    color: 'var(--accent-blue)',
    bg: 'var(--accent-blue-dim)',
  },
  {
    label: 'Messages Sent',
    value: '0',
    target: '/ 500 goal',
    progress: 0,
    change: '+0 today',
    isPositive: true,
    icon: MessageSquare,
    color: 'var(--accent-purple)',
    bg: 'var(--accent-purple-dim)',
  },
  {
    label: 'Replies',
    value: '0',
    target: '0% rate',
    progress: 0,
    change: '+0',
    isPositive: true,
    icon: TrendingUp,
    color: 'var(--primary)',
    bg: 'var(--primary-dim)',
  },
  {
    label: 'Meetings Booked',
    value: '0',
    target: '/ 10 goal',
    progress: 0,
    change: '+0 today',
    isPositive: true,
    icon: PhoneCall,
    color: 'var(--accent-green)',
    bg: 'var(--accent-green-dim)',
  },
  {
    label: 'Conversion %',
    value: '0.0%',
    target: 'leads → meetings',
    progress: 0,
    change: '+0.0%',
    isPositive: true,
    icon: Target,
    color: 'var(--accent-orange)',
    bg: 'var(--accent-orange-dim)',
  },
  {
    label: 'Revenue Pipeline',
    value: '$0',
    target: 'active deals',
    progress: 0,
    change: '+$0',
    isPositive: true,
    icon: DollarSign,
    color: 'var(--accent-green)',
    bg: 'var(--accent-green-dim)',
  },
];

export default function GrowthMetrics() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
            Today's Progress
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            Growth Metrics
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.375rem',
          padding: '4px 10px',
          borderRadius: '6px',
          background: 'var(--accent-green-dim)',
          color: 'var(--accent-green)',
          fontSize: '0.6875rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
        }}>
          <Calendar size={11} />
          LIVE TODAY
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {METRICS.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
              className="premium-card"
              style={{ padding: '1.25rem' }}
            >
              {/* Top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                <div style={{
                  width: '34px', height: '34px',
                  borderRadius: '9px',
                  background: metric.bg,
                  border: `1px solid ${metric.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={15} color={metric.color} />
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '2px',
                  fontSize: '0.6875rem', fontWeight: 700,
                  color: metric.isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
                  background: metric.isPositive ? 'var(--accent-green-dim)' : 'var(--accent-red-dim)',
                  padding: '2px 6px',
                  borderRadius: '5px',
                }}>
                  <ArrowUpRight size={10} />
                  {metric.change}
                </div>
              </div>

              {/* Value */}
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                {metric.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem', marginBottom: '0.875rem' }}>
                <span style={{ fontSize: '1.625rem', fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', color: 'var(--foreground)' }}>
                  {metric.value}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--foreground-subtle)', fontWeight: 500 }}>
                  {metric.target}
                </span>
              </div>

              {/* Progress */}
              <div className="progress-bar">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.progress}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.07, ease: [0.4, 0, 0.2, 1] }}
                  style={{ height: '100%', borderRadius: 'var(--radius-full)', background: metric.color }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.375rem' }}>
                <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--foreground-subtle)' }}>{metric.progress}% of goal</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
