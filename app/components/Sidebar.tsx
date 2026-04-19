"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  CheckSquare, 
  BarChart3, 
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  Menu,
  TrendingUp,
  Clock,
  LayoutList
} from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/' },
  { icon: <Zap size={20} />, label: 'AI COO', href: '/ai-coo' },
  { icon: <Target size={20} />, label: 'AI Hub', href: '/ai-hub' },
  { icon: <TrendingUp size={20} />, label: 'Revenue Brain', href: '/revenue-brain' },
  { icon: <Users size={20} />, label: 'Clients', href: '/clients' },
  { icon: <Clock size={20} />, label: 'Leads Pipeline', href: '/leads' },
  { icon: <CheckSquare size={20} />, label: 'Tasks', href: '/tasks' },
  { icon: <BarChart3 size={20} />, label: 'Reports', href: '/reports' },
  { icon: <LayoutList size={20} />, label: 'Team Supervisor', href: '/team-supervisor' },
  { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { state, toggleRail } = useSidebar();

  const isRail = state === 'rail';
  const isHidden = state === 'hidden';

  if (isHidden) return null;

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isRail ? '80px' : '280px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="glass"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        padding: isRail ? '1.5rem 0.75rem' : '1.5rem',
        borderRight: '1px solid var(--border)',
        overflow: 'hidden'
      }}
    >
      {/* Logo Section */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        marginBottom: '2.5rem',
        padding: isRail ? '0' : '0 0.5rem',
        justifyContent: isRail ? 'center' : 'flex-start'
      }}>
        <div style={{ 
          minWidth: '32px', 
          height: '32px', 
          background: 'var(--primary)', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000',
          fontWeight: 900
        }}>
          R
        </div>
        <AnimatePresence>
          {!isRail && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}
            >
              Reachly <span style={{ color: 'var(--primary)' }}>Pro</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div 
                className={isActive ? '' : 'btn-hover'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  backgroundColor: isActive ? 'rgba(250, 204, 21, 0.1)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                  justifyContent: isRail ? 'center' : 'flex-start',
                  position: 'relative'
                }}
              >
                <div style={{ minWidth: '20px' }}>{item.icon}</div>
                <AnimatePresence>
                  {!isRail && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && !isRail && (
                  <motion.div 
                    layoutId="active-pill"
                    style={{ position: 'absolute', right: '0.5rem', width: '4px', height: '16px', background: 'var(--primary)', borderRadius: '2px' }} 
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Toggle */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          onClick={toggleRail}
          className="glass btn-hover"
          style={{
            padding: '0.75rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            border: 'none',
            background: 'rgba(255,255,255,0.03)'
          }}
        >
          {isRail ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        
        {!isRail && (
          <Link href="/settings">
            <div style={{ 
              padding: '1rem', 
              borderRadius: '16px', 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer'
            }} className="btn-hover">
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Settings size={16} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>Administrator</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Agency OS Pro</div>
              </div>
            </div>
          </Link>
        )}
      </div>
    </motion.aside>
  );
}
