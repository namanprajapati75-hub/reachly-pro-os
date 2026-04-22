"use client";

import React from 'react';
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileDrawer from "./MobileDrawer";
import { useSidebar } from "./SidebarContext";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  const pathname = usePathname();

  const isRail = state === 'rail';
  const isHidden = state === 'hidden';

  const sidebarOffset = isHidden ? '0px' : isRail ? 'var(--sidebar-rail)' : 'var(--sidebar-width)';

  const isWorkspaceSelect = pathname === '/select-workspace';

  if (isWorkspaceSelect) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            style={{ width: '100%', minHeight: '100vh' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <Sidebar />
      <MobileDrawer />
      <Header />

      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarOffset }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        style={{
          marginTop: 'var(--header-height)',
          flex: 1,
          minHeight: 'calc(100vh - var(--header-height))',
          width: '100%',
          overflowX: 'hidden',
          padding: '2rem 1.75rem',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
