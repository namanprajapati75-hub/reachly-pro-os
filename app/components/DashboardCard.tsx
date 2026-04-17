"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: ReactNode;
  delay?: number;
}

export default function DashboardCard({ title, value, change, isPositive, icon, delay = 0 }: DashboardCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass" 
      style={{
        padding: '1.5rem',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        flex: 1,
        minWidth: '240px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '12px', 
          background: 'rgba(250, 204, 21, 0.1)', 
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
        {change && (
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 600, 
            color: isPositive ? '#22c55e' : '#ef4444',
            background: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            padding: '2px 8px',
            borderRadius: '100px'
          }}>
            {change}
          </span>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 400, marginBottom: '0.25rem' }}>{title}</h3>
        <p style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-outfit)' }}>{value}</p>
      </div>

      <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          transition={{ duration: 1, delay: delay + 0.3 }}
          style={{ height: '100%', background: 'var(--primary)' }}
        />
      </div>
    </motion.div>
  );
}
