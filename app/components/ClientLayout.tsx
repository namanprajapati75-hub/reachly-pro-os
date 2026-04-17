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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <Sidebar />
      <MobileDrawer />
      <Header />
      
      <motion.main 
        initial={false}
        animate={{ 
          marginLeft: isHidden ? '0' : (isRail ? '80px' : '280px'),
          padding: isHidden ? '1.5rem' : '2rem'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          marginTop: '70px',
          flex: 1,
          minHeight: 'calc(100vh - 70px)',
          width: '100%',
          overflowX: 'hidden'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
}
