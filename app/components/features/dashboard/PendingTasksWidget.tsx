"use client";

import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface PendingTasksWidgetProps {
  count: number;
}

export default function PendingTasksWidget({ count }: PendingTasksWidgetProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="glass" 
      style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}
    >
      <div style={{ 
        width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(250, 204, 21, 0.1)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center' 
      }}>
        <Clock size={22} color="var(--primary)" />
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Pending Ops
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>
          {count} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Tasks</span>
        </div>
      </div>
    </motion.div>
  );
}
