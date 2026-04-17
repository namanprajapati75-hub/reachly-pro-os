"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X,
  LayoutDashboard, 
  Users, 
  Target, 
  CheckSquare, 
  BarChart3, 
  Zap,
  Settings
} from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/' },
  { icon: <Users size={20} />, label: 'Clients', href: '/clients' },
  { icon: <Target size={20} />, label: 'Leads Pipeline', href: '/leads' },
  { icon: <Zap size={20} />, label: 'AI Lead Hub', href: '/ai-hub' },
  { icon: <CheckSquare size={20} />, label: 'Task Hub', href: '/tasks' },
  { icon: <BarChart3 size={20} />, label: 'Reports', href: '/reports' },
  { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
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
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(4px)',
              zIndex: 100
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '85%',
              maxWidth: '320px',
              background: 'var(--surface)',
              borderRight: '1px solid var(--border)',
              zIndex: 101,
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900 }}>R</div>
                  <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>Reachly</span>
               </div>
               <button onClick={toggleMobile} style={{ background: 'none', border: 'none', color: '#fff' }}>
                  <X size={24} />
               </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={toggleMobile}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      borderRadius: '14px',
                      background: isActive ? 'rgba(250, 204, 21, 0.1)' : 'transparent',
                      color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                      fontWeight: 600
                    }}>
                      {item.icon}
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
