"use client";

import { motion } from "framer-motion";
import { Flame, Cpu, BellRing, Target, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

interface AIInsight {
  id: string;
  type: 'hot_lead' | 'followup' | 'alert' | 'opportunity';
  title: string;
  description: string;
  action: string;
  actionHref: string;
  urgency: 'critical' | 'high' | 'medium';
}

const MOCK_INSIGHTS: AIInsight[] = [
  {
    id: '1',
    type: 'hot_lead',
    title: 'Marcus Johnson is ready to close',
    description: 'Opened email 4x, visited pricing page twice today. AI Score: 94',
    action: 'Send Proposal',
    actionHref: '/leads',
    urgency: 'critical',
  },
  {
    id: '2',
    type: 'followup',
    title: '3 leads need follow-up today',
    description: 'No response in 72hrs. High churn risk detected.',
    action: 'Start Sequence',
    actionHref: '/ai-hub',
    urgency: 'high',
  },
  {
    id: '3',
    type: 'alert',
    title: 'Minneapolis campaign underperforming',
    description: 'Open rate 9% vs 28% baseline. AI recommends subject line swap.',
    action: 'Fix Campaign',
    actionHref: '/ai-hub',
    urgency: 'high',
  },
  {
    id: '4',
    type: 'opportunity',
    title: 'Upsell window — 2 clients active',
    description: 'Revenue Brain detected buying signals from Johnson & Rivas accounts.',
    action: 'View Clients',
    actionHref: '/clients',
    urgency: 'medium',
  },
];

const TYPE_CONFIG = {
  hot_lead:    { icon: Flame, color: 'var(--accent-red)',    bg: 'var(--accent-red-dim)',    label: 'HOT LEAD' },
  followup:    { icon: BellRing, color: 'var(--accent-orange)', bg: 'var(--accent-orange-dim)', label: 'FOLLOW-UP' },
  alert:       { icon: Zap, color: 'var(--primary)',       bg: 'var(--primary-dim)',       label: 'ALERT' },
  opportunity: { icon: Target, color: 'var(--accent-green)', bg: 'var(--accent-green-dim)', label: 'OPPORTUNITY' },
};

const URGENCY_STYLE = {
  critical: { color: 'var(--accent-red)', bg: 'var(--accent-red-dim)' },
  high:     { color: 'var(--accent-orange)', bg: 'var(--accent-orange-dim)' },
  medium:   { color: 'var(--accent-green)', bg: 'var(--accent-green-dim)' },
};

interface AICommandCenterProps {
  hotLeads?: any[];
}

export default function AICommandCenter({ hotLeads = [] }: AICommandCenterProps) {
  const insights = MOCK_INSIGHTS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="premium-card"
      style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
            AI Engine
          </div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            Command Center
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.375rem',
          padding: '4px 10px',
          borderRadius: '6px',
          background: 'var(--primary-dim)',
          color: 'var(--primary)',
          fontSize: '0.6875rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
        }}>
          <Cpu size={11} />
          {insights.length} INSIGHTS
        </div>
      </div>

      {/* Insights List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        {insights.map((insight, i) => {
          const config = TYPE_CONFIG[insight.type];
          const urgency = URGENCY_STYLE[insight.urgency];
          const Icon = config.icon;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              style={{
                display: 'flex',
                gap: '0.875rem',
                padding: '1rem',
                borderRadius: '12px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                transition: 'all 0.2s ease',
                cursor: 'default',
              }}
              className="interactive-row"
            >
              {/* Icon */}
              <div style={{
                width: '36px', height: '36px',
                borderRadius: '9px',
                background: config.bg,
                border: `1px solid ${config.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={15} color={config.color} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.5625rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: urgency.bg,
                    color: urgency.color,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}>
                    {insight.urgency}
                  </span>
                  <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: 'var(--foreground-subtle)', letterSpacing: '0.08em' }}>
                    {config.label}
                  </span>
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.25rem' }}>
                  {insight.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)', lineHeight: 1.4 }}>
                  {insight.description}
                </div>
              </div>

              {/* Action */}
              <Link href={insight.actionHref} style={{ flexShrink: 0, alignSelf: 'center' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '3px',
                  padding: '5px 10px',
                  borderRadius: '7px',
                  background: 'var(--surface-3)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }} className="hover-bright">
                  {insight.action}
                  <ChevronRight size={11} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Footer link */}
      <Link href="/ai-hub">
        <div style={{
          marginTop: '1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem',
          padding: '0.625rem',
          borderRadius: '10px',
          border: '1px solid var(--border-primary)',
          background: 'var(--primary-dim)',
          color: 'var(--primary)',
          fontSize: '0.8125rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }} className="hover-bright">
          Open AI Hub
          <ChevronRight size={14} />
        </div>
      </Link>
    </motion.div>
  );
}
