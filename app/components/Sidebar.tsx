"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Target,
  CheckSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Activity,
  Sparkles,
} from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';

// ── Client nav (CRM & results dashboard) ───────────────────────
const clientNavSections = [
  {
    label: 'Core',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', color: 'var(--primary)' },
      { icon: Sparkles, label: 'AI Hub', href: '/ai-hub', color: 'var(--accent-blue)' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { icon: Clock, label: 'Leads Pipeline', href: '/leads', color: 'var(--accent-orange)' },
      { icon: TrendingUp, label: 'Revenue Brain', href: '/revenue-brain', color: 'var(--accent-green)' },
    ],
  },
  {
    label: 'Manage',
    items: [
      { icon: CheckSquare, label: 'Tasks', href: '/tasks', color: 'var(--accent-green)' },
      { icon: BarChart3, label: 'Reports', href: '/reports', color: 'var(--primary)' },
      { icon: Settings, label: 'Settings', href: '/settings', color: 'var(--foreground-subtle)' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { state, toggleRail } = useSidebar();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isRail = state === 'rail';
  const isHidden = state === 'hidden';

  if (isHidden) return null;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isRail ? 'var(--sidebar-rail)' : 'var(--sidebar-width)' }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      style={{
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        overflowX: 'hidden',
        overflowY: 'auto',
        padding: isRail ? '1.25rem 0.75rem' : '1.5rem 1rem',
      }}
    >
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        marginBottom: '0.75rem',
        justifyContent: isRail ? 'center' : 'flex-start',
        paddingLeft: isRail ? '0' : '0.25rem',
      }}>
        <div style={{
          width: '34px', height: '34px',
          background: 'linear-gradient(135deg, #4f8ef7 0%, #2563eb 100%)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#000',
          fontWeight: 900,
          fontSize: '0.875rem',
          fontFamily: 'var(--font-display)',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(79,142,247,0.25)',
          letterSpacing: '-0.01em',
        }}>
          R
        </div>
        <AnimatePresence>
          {!isRail && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.0625rem',
                letterSpacing: '-0.03em',
                color: 'var(--foreground)',
              }}>
                Reachly <span style={{ color: 'var(--accent-blue)' }}>OS</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mode Badge */}
      <AnimatePresence>
        {!isRail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ marginBottom: '1.5rem', paddingLeft: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '0.625rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: 'rgba(79,142,247,0.12)',
              color: 'var(--accent-blue)',
              border: '1px solid rgba(79,142,247,0.25)',
            }}>
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: 'var(--accent-blue)',
              }}></span>
              Client Mode
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {clientNavSections.map((section) => (
          <div key={section.label}>
            <AnimatePresence>
              {!isRail && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--foreground-subtle)',
                    paddingLeft: '0.625rem',
                    marginBottom: '0.375rem',
                  }}
                >
                  {section.label}
                </motion.div>
              )}
            </AnimatePresence>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      onHoverStart={() => setHoveredItem(item.href)}
                      onHoverEnd={() => setHoveredItem(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: isRail ? '0.625rem' : '0.625rem 0.75rem',
                        borderRadius: '10px',
                        backgroundColor: isActive
                          ? 'rgba(79, 142, 247, 0.1)'
                          : hoveredItem === item.href
                          ? 'var(--glass-hover)'
                          : 'transparent',
                        color: isActive ? item.color : 'var(--foreground-muted)',
                        transition: 'all 0.15s ease',
                        justifyContent: isRail ? 'center' : 'flex-start',
                        position: 'relative',
                        cursor: 'pointer',
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: '20%',
                            bottom: '20%',
                            width: '3px',
                            background: item.color,
                            borderRadius: '0 3px 3px 0',
                            boxShadow: `0 0 8px ${item.color}`,
                          }}
                        />
                      )}
                      <div style={{ flexShrink: 0, color: isActive ? item.color : 'inherit' }}>
                        <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                      </div>
                      <AnimatePresence>
                        {!isRail && (
                          <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.15 }}
                            style={{
                              fontSize: '0.8125rem',
                              fontWeight: isActive ? 700 : 500,
                              whiteSpace: 'nowrap',
                              color: isActive ? 'var(--foreground)' : 'var(--foreground-muted)',
                            }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem' }}>
        {/* System Status */}
        <AnimatePresence>
          {!isRail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                padding: '0.875rem',
                borderRadius: '12px',
                background: 'rgba(34, 211, 163, 0.04)',
                border: '1px solid rgba(34, 211, 163, 0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
              }}
            >
              <div className="live-dot" style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--accent-green)', letterSpacing: '0.06em' }}>
                  ALL SYSTEMS LIVE
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--foreground-subtle)', marginTop: '1px' }}>
                  AI engine · 12 automations running
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse Toggle */}
        <button
          onClick={toggleRail}
          style={{
            padding: '0.625rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isRail ? 'center' : 'flex-start',
            gap: '0.5rem',
            color: 'var(--foreground-subtle)',
            background: 'transparent',
            border: '1px solid var(--border)',
            transition: 'all 0.15s ease',
            cursor: 'pointer',
          }}
          className="hover-bright"
        >
          {isRail ? <ChevronRight size={15} /> : (
            <>
              <ChevronLeft size={15} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Collapse</span>
            </>
          )}
        </button>

        {/* User Card */}
        <AnimatePresence>
          {!isRail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Link href="/settings">
                <div style={{
                  padding: '0.875rem',
                  borderRadius: '12px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }} className="hover-bright">
                  <div style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4f8ef7 0%, #2563eb 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.6875rem',
                    flexShrink: 0,
                  }}>
                    NP
                  </div>
                  <div style={{ overflow: 'hidden', flex: 1 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--foreground)', whiteSpace: 'nowrap' }}>
                      Naman Prajapati
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--foreground-muted)', whiteSpace: 'nowrap' }}>
                      Agency Owner · Pro
                    </div>
                  </div>
                  <Activity size={13} color="var(--accent-green)" />
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
