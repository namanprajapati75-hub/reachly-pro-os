"use client";

import { FileText, ChevronRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ReportsDueWidgetProps {
  draftCount: number;
}

export default function ReportsDueWidget({ draftCount }: ReportsDueWidgetProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass" 
      style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={20} color="var(--primary)" />
        </div>
        {draftCount > 0 && (
          <div style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.625rem', fontWeight: 800 }}>
            {draftCount} PENDING
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Report Approval Queue</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-outfit)', marginTop: '0.25rem' }}>
          {draftCount} <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>Drafts</span>
        </div>
      </div>

      <Link href="/reports" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
        GO TO HUB <ChevronRight size={14} />
      </Link>
    </motion.div>
  );
}
