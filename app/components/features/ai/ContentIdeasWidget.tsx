"use client";

import { useState } from "react";
import { Sparkles, RefreshCcw, Copy, CheckCircle2, Video, Megaphone, Gift, Layout } from "lucide-react";
import { getClientContentIdeas } from "@/app/actions/aiHub";
import { motion, AnimatePresence } from "framer-motion";

interface ContentIdeasWidgetProps {
  clientId: string;
}

export default function ContentIdeasWidget({ clientId }: ContentIdeasWidgetProps) {
  const [ideas, setIdeas] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await getClientContentIdeas(clientId);
      setIdeas(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!ideas) return;
    navigator.clipboard.writeText(ideas);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass" style={{ padding: '2rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Sparkles size={24} color="var(--primary)" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>AI Content Strategy</h3>
        </div>
        {ideas && (
          <button 
            onClick={handleGenerate} 
            disabled={loading}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCcw size={14} className={loading ? 'spin' : ''} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>REGENERATE</span>
          </button>
        )}
      </div>

      {!ideas ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Generate viral reel ideas, ad copy variations, and promotional offers tailored to this client's brand.
          </p>
          <button 
            onClick={handleGenerate}
            disabled={loading}
            style={{ 
              width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--primary)', 
              color: '#000', border: 'none', fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
            }}
          >
            {loading ? <RefreshCcw size={18} className="spin" /> : <Sparkles size={18} />}
            {loading ? 'ANALYZING BRAND...' : 'GENERATE CONTENT IDEAS'}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ 
            maxHeight: '400px', overflowY: 'auto', fontSize: '0.875rem', lineHeight: 1.6, 
            color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.02)', 
            padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', whiteSpace: 'pre-line' 
          }}>
            {ideas}
          </div>
          <button 
            onClick={copyToClipboard}
            style={{ 
              width: '100%', padding: '0.75rem', borderRadius: '12px', 
              background: copied ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.05)', 
              color: copied ? '#22c55e' : '#fff', border: '1px solid var(--border)', 
              fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
            }}
          >
            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            {copied ? 'COPIED TO CLIPBOARD' : 'COPY ALL IDEAS'}
          </button>
        </motion.div>
      )}

      {/* Subtle Background Icon Decoration */}
      <Video size={100} style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.03, pointerEvents: 'none' }} />
    </div>
  );
}
