"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface PremiumEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function PremiumEmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: PremiumEmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        width: '100%',
        padding: '6rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '1.5rem'
      }}
    >
      <div className="glass" style={{
        padding: '2.5rem',
        borderRadius: '32px',
        background: 'rgba(255,255,255,0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--primary)',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
      }}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: 48 })}
      </div>

      <div style={{ maxWidth: '400px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', fontFamily: 'var(--font-outfit)' }}>
          {title}
        </h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '1rem' }}>
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="glass btn-hover"
          style={{
            marginTop: '1rem',
            padding: '1rem 2rem',
            borderRadius: '16px',
            background: 'var(--primary)',
            color: '#000',
            border: 'none',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <Plus size={20} />
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
