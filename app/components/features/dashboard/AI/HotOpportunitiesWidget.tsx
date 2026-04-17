"use client";

import { Zap, Flame, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface HotLead {
  id: string;
  name: string;
  aiScore: number;
}

interface HotOpportunitiesWidgetProps {
  leads: HotLead[];
}

export default function HotOpportunitiesWidget({ leads }: HotOpportunitiesWidgetProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass" 
      style={{ padding: '2rem', borderRadius: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'linear-gradient(135deg, rgba(202, 138, 4, 0.05) 0%, rgba(15, 15, 15, 1) 100%)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Flame size={22} color="#ef4444" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Hot Opportunities</h3>
        </div>
        <Link href="/ai-hub" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          SMART INBOX <ChevronRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {leads.length > 0 ? leads.map((lead) => (
          <div key={lead.id} className="glass" style={{ 
            padding: '1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.02)',
            display: 'flex', alignItems: 'center', gap: '1.25rem'
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(202, 138, 4, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900, color: 'var(--primary)' }}>
               {lead.aiScore}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.925rem' }}>{lead.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High-Probability Conversion</div>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No hot leads identified today.
          </div>
        )}
      </div>
    </motion.div>
  );
}
