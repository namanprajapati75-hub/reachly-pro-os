"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X, LayoutDashboard, Users, Target, CheckSquare,
  BarChart3, Zap, Settings, TrendingUp, Clock,
  LayoutList, Cpu, Sparkles, Activity,
} from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',    href: '/' },
  { icon: Cpu,             label: 'AI COO',       href: '/ai-coo' },
  { icon: Sparkles,        label: 'AI Hub',       href: '/ai-hub' },
  { icon: TrendingUp,      label: 'Revenue',      href: '/revenue-brain' },
  { icon: Users,           label: 'Clients',      href: '/clients' },
  { icon: Clock,           label: 'Leads',        href: '/leads' },
  { icon: CheckSquare,     label: 'Tasks',        href: '/tasks' },
  { icon: BarChart3,       label: 'Reports',      href: '/reports' },
  { icon: LayoutList,      label: 'Team',         href: '/team-supervisor' },
  { icon: Settings,        label: 'Settings',     href: '/settings' },
];

export default function MobileDrawer() {
  const { isMobileOpen, toggleMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobile}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)',
              zIndex: 100,
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0,
              width: '80%', maxWidth: '300px',
              background: 'var(--surface)',
              borderRight: '1px solid var(--border)',
              zIndex: 101,
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Logo + Close */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1.25rem 1.25rem 1rem',
              borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{
                  width: '32px', height: '32px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#000', fontWeight: 900, fontSize: '0.875rem',
                  fontFamily: 'var(--font-display)',
                  boxShadow: '0 4px 10px var(--primary-glow)',
                }}>
                  R
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>
                  Reachly <span style={{ color: 'var(--primary)' }}>OS</span>
                </span>
              </div>
              <button
                onClick={toggleMobile}
                style={{
                  width: '32px', height: '32px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--foreground-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '0.875rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={toggleMobile}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.75rem 0.875rem',
                      borderRadius: '10px',
                      background: isActive ? 'var(--primary-dim)' : 'transparent',
                      color: isActive ? 'var(--primary)' : 'var(--foreground-muted)',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.875rem',
                      transition: 'all 0.15s ease',
                      borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                    }}>
                      <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* User Footer */}
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid var(--border)' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.875rem', borderRadius: '12px',
                background: 'var(--surface-2)', border: '1px solid var(--border)',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#000', fontWeight: 800, fontSize: '0.625rem', flexShrink: 0,
                }}>
                  NP
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--foreground)' }}>Naman Prajapati</div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--foreground-muted)' }}>Agency Owner · Pro</div>
                </div>
                <Activity size={13} color="var(--accent-green)" style={{ marginLeft: 'auto' }} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
