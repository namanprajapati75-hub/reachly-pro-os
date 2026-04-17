"use client";

import { Bell, Search, User } from "lucide-react";

export default function Header() {
  return (
    <header className="glass" style={{
      height: '70px',
      width: 'calc(100% - 280px)',
      position: 'fixed',
      top: 0,
      left: '280px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      zIndex: 90,
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="search-bar" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'rgba(255,255,255,0.03)',
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        border: '1px solid var(--border)',
        width: '300px'
      }}>
        <Search size={18} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search leads, clients, tasks..." 
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

      <div className="header-actions" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <button style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          position: 'relative'
        }}>
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

        <div className="user-profile" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.25rem 0.5rem',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, var(--primary), #ca8a04)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            fontWeight: 700,
            fontSize: '0.75rem'
          }}>
            AS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Agency Space</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
