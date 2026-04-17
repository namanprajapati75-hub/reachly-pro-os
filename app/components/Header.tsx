"use client";

import { Bell, Search, User, Menu } from "lucide-react";
import { useState } from "react";
import NotificationDrawer from "./NotificationDrawer";
import { useSidebar } from "./SidebarContext";
import { motion } from "framer-motion";

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { state, toggleMobile } = useSidebar();

  const isRail = state === 'rail';
  const isHidden = state === 'hidden';

  return (
    <>
      <motion.header 
        initial={false}
        animate={{ 
          width: isHidden ? '100%' : (isRail ? 'calc(100% - 80px)' : 'calc(100% - 280px)'),
          left: isHidden ? '0' : (isRail ? '80px' : '280px')
        }}
        className="glass" 
        style={{
          height: '70px',
          position: 'fixed',
          top: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          zIndex: 90,
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isHidden && (
            <button 
              onClick={toggleMobile}
              className="glass"
              style={{
                padding: '0.625rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Menu size={20} />
            </button>
          )}
          
          <div className="search-bar" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(255,255,255,0.03)',
            padding: '0.5rem 1rem',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            width: '280px',
          }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Quick search..." 
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--foreground)',
                fontSize: '0.875rem',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>
        </div>

        <div className="header-actions" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem'
        }}>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="btn-hover"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Bell size={20} />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              background: 'var(--primary)',
              borderRadius: '50%',
              border: '2px solid var(--background)'
            }}></span>
          </button>

          <div className="user-profile card-hover" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.4rem 0.75rem',
            borderRadius: '12px',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.02)'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              background: 'linear-gradient(135deg, var(--primary), #ca8a04)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontWeight: 800,
              fontSize: '0.625rem'
            }}>
              AS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }} className="mobile-hide">
              <span style={{ fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.2 }}>Agency Pro</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1 }}>Admin</span>
            </div>
          </div>
        </div>
      </motion.header>

      <NotificationDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />

      <style jsx>{`
        @media (max-width: 640px) {
          .search-bar { display: none !important; }
          .mobile-hide { display: none !important; }
        }
      `}</style>
    </>
  );
}
