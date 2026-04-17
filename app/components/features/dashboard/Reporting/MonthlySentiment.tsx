"use client";

import { Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface MonthlySentimentProps {
  avgCsat: number;
}

export default function MonthlySentiment({ avgCsat }: MonthlySentimentProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="glass" 
      style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(202, 138, 4, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Star size={20} color="var(--primary)" fill="var(--primary)" />
        </div>
        <div style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', fontSize: '0.625rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <TrendingUp size={10} /> +5%
        </div>
      </div>

      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Partnership Sentiment</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-outfit)', marginTop: '0.25rem', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
          {avgCsat.toFixed(1)} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ 5.0</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4px', marginTop: '0.5rem' }}>
         {[1,2,3,4,5].map((s) => (
           <div key={s} style={{ flex: 1, height: '4px', background: s <= Math.round(avgCsat) ? 'var(--primary)' : 'rgba(255,255,255,0.05)', borderRadius: '2px' }}></div>
         ))}
      </div>
    </motion.div>
  );
}
