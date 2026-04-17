"use client";

import { AlertCircle, RefreshCcw, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface AtRiskLeadWidgetProps {
  count: number;
}

export default function AtRiskLeadWidget({ count }: AtRiskLeadWidgetProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="glass" 
      style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, border: count > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border)' }}
    >
      <div style={{ 
        width: '44px', height: '44px', borderRadius: '12px', background: count > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center' 
      }}>
        <AlertCircle size={22} color={count > 0 ? '#ef4444' : 'var(--text-muted)'} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
          Lifecycle Alert
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>
          {count} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>At Risk</span>
        </div>
      </div>
      <Link href="/ai-hub" style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
         <RefreshCcw size={16} color="var(--primary)" />
      </Link>
    </motion.div>
  );
}
