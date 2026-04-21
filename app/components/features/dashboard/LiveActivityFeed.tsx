"use client";

import { motion } from "framer-motion";
import { MessageSquare, PhoneCall, UserPlus, Cpu, ArrowRight, Clock } from "lucide-react";

const FEED_ITEMS = [
  {
    id: '1',
    type: 'reply',
    icon: MessageSquare,
    color: 'var(--accent-blue)',
    bg: 'var(--accent-blue-dim)',
    title: 'New reply from Marcus Johnson',
    meta: 'Interested in Q2 growth package',
    time: '2m ago',
    dot: 'live' as const,
  },
  {
    id: '2',
    type: 'ai',
    icon: Cpu,
    color: 'var(--accent-purple)',
    bg: 'var(--accent-purple-dim)',
    title: 'AI drafted follow-up sequence',
    meta: '8 contacts · Minneapolis campaign',
    time: '7m ago',
    dot: 'live' as const,
  },
  {
    id: '3',
    type: 'meeting',
    icon: PhoneCall,
    color: 'var(--accent-green)',
    bg: 'var(--accent-green-dim)',
    title: 'Meeting booked — Sarah Chen',
    meta: 'Tomorrow 2:00 PM via Calendly',
    time: '14m ago',
    dot: 'warning' as const,
  },
  {
    id: '4',
    type: 'lead',
    icon: UserPlus,
    color: 'var(--primary)',
    bg: 'var(--primary-dim)',
    title: '6 new leads added',
    meta: 'Chicago · Restaurant vertical',
    time: '28m ago',
    dot: 'idle' as const,
  },
  {
    id: '5',
    type: 'ai',
    icon: Cpu,
    color: 'var(--accent-purple)',
    bg: 'var(--accent-purple-dim)',
    title: 'AI flagged 3 weak campaigns',
    meta: 'Open rate below 15% threshold',
    time: '45m ago',
    dot: 'warning' as const,
  },
  {
    id: '6',
    type: 'meeting',
    icon: PhoneCall,
    color: 'var(--accent-green)',
    bg: 'var(--accent-green-dim)',
    title: 'Meeting booked — Derek Ross',
    meta: 'Today 4:30 PM · Discovery call',
    time: '1h ago',
    dot: 'idle' as const,
  },
];

export default function LiveActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="premium-card"
      style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
            Live Activity
          </div>
          <div style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            Real-Time Feed
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <div className="live-dot" />
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-green)', letterSpacing: '0.06em' }}>LIVE</span>
        </div>
      </div>

      {/* Feed Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
        {FEED_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
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
              {/* Icon */}
              <div style={{
                width: '34px', height: '34px',
                borderRadius: '9px',
                background: item.bg,
                border: `1px solid ${item.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={15} color={item.color} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--foreground-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>
                  {item.meta}
                </div>
              </div>

              {/* Time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
                <span className={`status-dot ${item.dot}`} />
                <span style={{ fontSize: '0.6875rem', color: 'var(--foreground-subtle)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                  {item.time}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <button style={{
        marginTop: '0.75rem',
        width: '100%',
        padding: '0.625rem',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        background: 'transparent',
        color: 'var(--foreground-muted)',
        fontSize: '0.8125rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.375rem',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }} className="hover-bright">
        View full activity log
        <ArrowRight size={13} />
      </button>
    </motion.div>
  );
}
