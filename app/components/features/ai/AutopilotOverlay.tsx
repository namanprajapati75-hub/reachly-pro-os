"use client";

import { useState } from "react";
import { 
  Zap, 
  Target, 
  CheckSquare, 
  TrendingUp, 
  AlertCircle, 
  Sparkles, 
  X,
  Play,
  ArrowRight,
  User,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAutopilotSummary } from "@/app/actions/aiHub";

export default function AutopilotOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const startAutopilot = async () => {
    setLoading(true);
    setIsOpen(true);
    try {
      const summary = await getAutopilotSummary();
      setData(summary);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ position: 'relative' }}>
        <button 
          onClick={startAutopilot}
          className="btn-hover"
          style={{ 
            background: 'var(--primary)', 
            color: '#000', 
            padding: '1.25rem 2.5rem', 
            borderRadius: '16px', 
            fontWeight: 900, 
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 0 30px rgba(250, 204, 21, 0.3)'
          }}
        >
          <Play size={20} fill="#000" />
          RUN MY AGENCY TODAY
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', 
              backdropFilter: 'blur(10px)', zIndex: 1000, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass"
              style={{ 
                width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto',
                borderRadius: '32px', border: '1px solid rgba(250, 204, 21, 0.2)',
                padding: '3rem', position: 'relative'
              }}
            >
              <button 
                onClick={() => setIsOpen(false)}
                style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                   <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2rem' }}>
                      <Zap size={80} className="spin" color="var(--primary)" style={{ opacity: 0.2 }} />
                      <Sparkles size={40} className="pulse" color="var(--primary)" style={{ position: 'absolute', top: '20px', left: '20px' }} />
                   </div>
                   <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Synchronizing Agency Data...</h2>
                   <p style={{ color: 'var(--text-muted)' }}>AI Agent is calculating priorities and revenue opportunities.</p>
                </div>
              ) : data && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                   <header style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                        <ShieldCheck size={28} />
                        <span style={{ fontWeight: 800, letterSpacing: '0.2em', fontSize: '0.875rem' }}>ALPHA AUTOPILOT ACTIVATED</span>
                      </div>
                      <h2 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-outfit)' }}>{data.suggestedFounderFocus}</h2>
                   </header>

                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                      <Section icon={<Target size={18} />} title="Who to Contact" items={data.whoToContact.map((l: any) => `${l.name} (${l.reason})`)} color="var(--primary)" />
                      <Section icon={<CheckSquare size={18} />} title="Tasks to Finish" items={data.tasksToFinish} color="#fff" />
                      <Section icon={<TrendingUp size={18} />} title="Revenue Hooks" items={data.revenueOpportunities} color="#22c55e" />
                      <Section icon={<AlertCircle size={18} />} title="Risk Alerts" items={data.clientAlerts} color="#ef4444" />
                   </div>

                   <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>TEAM STATUS</div>
                        <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <Activity size={16} color={data.teamBottlenecks === 'None detected' ? '#22c55e' : '#ef4444'} />
                           {data.teamBottlenecks}
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsOpen(false)}
                        style={{ background: 'var(--primary)', color: '#000', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                      >
                        CONFIRM STRATEGY <ArrowRight size={18} />
                      </button>
                   </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Section({ icon, title, items, color }: { icon: any, title: string, items: string[], color: string }) {
  return (
    <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--text-muted)' }}>
        {icon}
        <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>{title}</h4>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.length > 0 ? items.map((item, i) => (
          <div key={i} style={{ fontSize: '0.875rem', fontWeight: 600, color }}>{item}</div>
        )) : (
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Clear for today</div>
        )}
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
