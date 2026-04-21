"use client";

import { motion } from "framer-motion";
import { Users, Flame, ThermometerSun, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PipelineStage {
  label: string;
  count: number;
  value: number;
  color: string;
  bg: string;
  icon: typeof Users;
  href: string;
}

const STAGES: PipelineStage[] = [
  { label: 'Cold Leads',      count: 142, value: 142000, color: '#4f8ef7', bg: 'rgba(79,142,247,0.08)',  icon: Users,         href: '/leads' },
  { label: 'Warm Leads',      count: 67,  value: 201000, color: '#f5c842', bg: 'rgba(245,200,66,0.08)', icon: ThermometerSun, href: '/leads' },
  { label: 'Hot Leads',       count: 23,  value: 138000, color: '#f05252', bg: 'rgba(240,82,82,0.08)',  icon: Flame,         href: '/leads' },
  { label: 'Followup Needed', count: 38,  value: 95000,  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: Clock,         href: '/tasks' },
  { label: 'Closed Won',      count: 18,  value: 216000, color: '#22d3a3', bg: 'rgba(34,211,163,0.08)', icon: CheckCircle2,  href: '/clients' },
];

const totalLeads = STAGES.reduce((acc, s) => acc + s.count, 0);

export default function PipelineView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5 }}
      className="premium-card"
      style={{ padding: '1.75rem' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
            Pipeline
          </div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            Lead Funnel Overview
          </div>
        </div>
        <Link href="/leads">
          <div style={{
            display: 'flex', alignItems: 'center', gap: '3px',
            fontSize: '0.75rem', fontWeight: 700,
            color: 'var(--primary)',
          }} className="hover-bright">
            Manage <ChevronRight size={14} />
          </div>
        </Link>
      </div>

      {/* Funnel Bar */}
      <div style={{ display: 'flex', height: '8px', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '1.5rem', gap: '2px' }}>
        {STAGES.map((stage, i) => (
          <motion.div
            key={i}
            initial={{ width: 0 }}
            animate={{ width: `${(stage.count / totalLeads) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: [0.4, 0, 0.2, 1] }}
            style={{ background: stage.color, borderRadius: 'var(--radius-full)' }}
          />
        ))}
      </div>

      {/* Stage Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          const widthPct = Math.round((stage.count / totalLeads) * 100);
          return (
            <Link key={i} href={stage.href}>
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="interactive-row"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '10px',
                }}
              >
                <div style={{
                  width: '32px', height: '32px',
                  borderRadius: '8px',
                  background: stage.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={14} color={stage.color} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>{stage.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--foreground-subtle)' }}>{widthPct}%</span>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--foreground)', fontFamily: 'var(--font-display)', minWidth: '28px', textAlign: 'right' }}>
                        {stage.count}
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ duration: 1, delay: 0.7 + i * 0.1 }}
                      style={{ height: '100%', borderRadius: 'var(--radius-full)', background: stage.color }}
                    />
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Total Row */}
      <div style={{
        marginTop: '1rem',
        padding: '0.875rem',
        borderRadius: '10px',
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>Total Pipeline Leads</span>
        <span style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--foreground)', letterSpacing: '-0.03em' }}>
          {totalLeads}
        </span>
      </div>
    </motion.div>
  );
}
