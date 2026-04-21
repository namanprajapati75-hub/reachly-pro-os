"use client";

import { Bell, Search, Command, Zap, ChevronDown, Menu, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import NotificationDrawer from "./NotificationDrawer";
import { useSidebar } from "./SidebarContext";
import { motion, AnimatePresence } from "framer-motion";
import { getNotifications } from "@/app/actions/notifications";

const QUICK_ACTIONS = [
  { label: 'Add Lead', href: '/leads', shortcut: 'L' },
  { label: 'New Task', href: '/tasks', shortcut: 'T' },
  { label: 'View Reports', href: '/reports', shortcut: 'R' },
];

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const { state, toggleMobile } = useSidebar();
  const [currentTime, setCurrentTime] = useState('');

  const isRail = state === 'rail';
  const isHidden = state === 'hidden';

  const sidebarOffset = isHidden ? '0px' : isRail ? 'var(--sidebar-rail)' : 'var(--sidebar-width)';

  const fetchNotificationCount = async () => {
    const data = await getNotifications();
    setUnreadCount(data.filter((n: any) => !n.isRead).length);
  };

  useEffect(() => {
    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          width: `calc(100% - ${sidebarOffset})`,
          left: sidebarOffset,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        style={{
          height: 'var(--header-height)',
          position: 'fixed',
          top: 0,
          zIndex: 40,
          background: 'rgba(6, 6, 8, 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          gap: '1rem',
        }}
      >
        {/* Left: Mobile Menu + Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
          {isHidden && (
            <button
              onClick={toggleMobile}
              style={{
                width: '36px', height: '36px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--foreground-muted)',
                background: 'transparent',
                flexShrink: 0,
              }}
            >
              <Menu size={18} />
            </button>
          )}

          {/* Search */}
          <motion.div
            animate={{ width: searchFocused ? '360px' : '280px' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              background: searchFocused ? 'var(--surface-2)' : 'var(--surface)',
              padding: '0 0.875rem',
              height: '36px',
              borderRadius: '10px',
              border: `1px solid ${searchFocused ? 'var(--border-medium)' : 'var(--border)'}`,
              transition: 'background 0.2s, border-color 0.2s',
              flexShrink: 0,
            }}
            className="hide-mobile"
          >
            <Search size={14} color={searchFocused ? 'var(--foreground-muted)' : 'var(--foreground-subtle)'} />
            <input
              type="text"
              placeholder="Search leads, tasks, clients…"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--foreground)',
                fontSize: '0.8125rem',
                outline: 'none',
                flex: 1,
                '::placeholder': { color: 'var(--foreground-subtle)' },
              }}
            />
            <div style={{
              display: 'flex', alignItems: 'center', gap: '2px',
              background: 'var(--surface-3)',
              padding: '2px 6px',
              borderRadius: '5px',
              border: '1px solid var(--border)',
              flexShrink: 0,
            }}>
              <Command size={9} color="var(--foreground-subtle)" />
              <span style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--foreground-subtle)' }}>K</span>
            </div>
          </motion.div>
        </div>

        {/* Center: Quick Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="hide-tablet">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div className="live-dot" />
            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--accent-green)', letterSpacing: '0.06em' }}>
              LIVE
            </span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Zap size={12} color="var(--primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>
              12 automations active
            </span>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground-subtle)', fontFamily: 'var(--font-mono)' }}>
            {currentTime}
          </span>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Notifications */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            style={{
              width: '36px', height: '36px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--foreground-muted)',
              background: 'transparent',
              position: 'relative',
              transition: 'all 0.15s ease',
            }}
            className="hover-bright"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '6px', right: '6px',
                width: '7px', height: '7px',
                background: 'var(--accent-red)',
                borderRadius: '50%',
                border: '1.5px solid var(--background)',
                boxShadow: '0 0 6px var(--accent-red)',
              }} />
            )}
          </button>

          {/* User */}
          <Link href="/settings">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.375rem 0.75rem 0.375rem 0.375rem',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }} className="hover-bright">
              <div style={{
                width: '28px', height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#000',
                fontWeight: 800,
                fontSize: '0.625rem',
                flexShrink: 0,
              }}>
                NP
              </div>
              <div className="hide-mobile">
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, lineHeight: 1.2, color: 'var(--foreground)' }}>
                  Naman
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--foreground-muted)' }}>Agency Pro</div>
              </div>
            </div>
          </Link>
        </div>
      </motion.header>

      <NotificationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onReadAction={fetchNotificationCount}
      />

      <style>{`
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
        }
        @media (max-width: 1024px) {
          .hide-tablet { display: none !important; }
        }
      `}</style>
    </>
  );
}
