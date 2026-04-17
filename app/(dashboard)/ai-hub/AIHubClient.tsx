"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  Inbox, 
  RefreshCcw, 
  LayoutList,
  Target,
  AlertCircle,
  Clock,
  Zap,
  Filter,
  User,
  Sparkles
} from "lucide-react";
import LeadDetailAssistant from "@/app/components/features/ai/LeadDetailAssistant";
import { motion, AnimatePresence } from "framer-motion";

interface AIHubClientProps {
  initialData: {
    active: any[];
    reactivation: any[];
    all: any[];
  };
}

export default function AIHubClient({ initialData }: AIHubClientProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'reactivation' | 'all'>('active');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const currentLeads = initialData[activeTab].filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (lead.company || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTempColor = (temp: string) => {
    if (temp === 'Hot') return '#ef4444';
    if (temp === 'Warm') return '#facc15';
    return 'var(--text-muted)';
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', height: 'calc(100vh - 120px)' }}>
      {/* Left Column: Inbox List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', overflow: 'hidden' }}>
        <header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Smart Inbox</h1>
            <div className="glass" style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Target size={18} color="var(--primary)" />
            </div>
          </div>
          
          <div className="glass" style={{ display: 'flex', padding: '4px', borderRadius: '12px', marginBottom: '1.5rem' }}>
            {(['active', 'reactivation', 'all'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '8px', fontSize: '0.75rem', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: activeTab === tab ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                  textTransform: 'uppercase'
                }}
              >
                {tab === 'reactivation' ? 'Reactivation' : tab}
              </button>
            ))}
          </div>

          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem', borderRadius: '12px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem' }}>
          {currentLeads.length > 0 ? currentLeads.map((lead) => (
            <motion.div
              layoutId={lead.id}
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className="glass"
              style={{
                padding: '1.25rem', borderRadius: '16px', cursor: 'pointer',
                border: selectedLead?.id === lead.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: selectedLead?.id === lead.id ? 'rgba(202, 138, 4, 0.05)' : 'rgba(255,255,255,0.02)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h4 style={{ fontWeight: 700, fontSize: '0.925rem' }}>{lead.name}</h4>
                <div style={{ fontSize: '0.625rem', fontWeight: 900, color: getTempColor(lead.temperature) }}>
                  {lead.temperature.toUpperCase()}
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{lead.company || 'Personal'}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                   {[1,2,3,4,5].map(i => (
                     <div key={i} style={{ width: '3px', height: '10px', background: i <= (lead.aiScore/20) ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '1px' }}></div>
                   ))}
                </div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                   <Clock size={10} />
                   {Math.floor((new Date().getTime() - new Date(lead.lastContactedAt).getTime()) / (1000 * 60 * 60 * 24))}d ago
                </div>
              </div>

              {lead.status === 'At_Risk' && (
                <div style={{ 
                  position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', 
                  background: '#ef4444', borderRadius: '50%', border: '2px solid var(--background)',
                  boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                }}></div>
              )}
            </motion.div>
          )) : (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
               <Inbox size={48} color="var(--text-muted)" style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
               <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Zero leads found in this view.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Lead Analysis & Assistant */}
      <div style={{ height: '100%', position: 'relative' }}>
         {selectedLead ? (
           <div className="glass" style={{ height: '100%', borderRadius: '24px', padding: '3rem', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-outfit)' }}>{selectedLead.name}</h2>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>{selectedLead.company}</span>
                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Lead ID: #{selectedLead.id.slice(-4)}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)' }}>{selectedLead.aiScore}%</div>
                   <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>CONFIDENCE SCORE</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px' }}>
                   <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Current Status</h3>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: selectedLead.status === 'At_Risk' ? '#ef4444' : 'var(--primary)' }}></div>
                      <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>{selectedLead.status.replace('_', ' ')}</span>
                   </div>
                </div>
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px' }}>
                   <h3 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Source Origin</h3>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Zap size={18} color="var(--primary)" />
                      <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>{selectedLead.source}</span>
                   </div>
                </div>
              </div>

              <div className="glass" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(202, 138, 4, 0.03)', border: '1px solid rgba(202, 138, 4, 0.1)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <AlertCircle size={20} color="var(--primary)" />
                    <h3 style={{ fontWeight: 800 }}>AI Strategic Summary</h3>
                 </div>
                 <p style={{ lineHeight: 1.6, color: 'var(--foreground)', fontSize: '0.925rem' }}>
                   Lead demonstrates high relevance but {selectedLead.status === 'At_Risk' ? 'engagement has dropped significantly in the last 7 days. Critical intervention required to prevent cooling.' : 'is showing standard engagement metrics. Recommended to push for a Discovery Call via the Objections panel.'}
                 </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                 <button onClick={() => setSelectedLead(selectedLead)} style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'var(--primary)', color: '#000', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                   OPEN SALES ASSISTANT
                 </button>
                 <button className="glass" style={{ flex: 1, padding: '1rem', borderRadius: '12px', fontWeight: 700 }}>
                   VIEW FULL PROFILE
                 </button>
              </div>
           </div>
         ) : (
           <div className="glass" style={{ height: '100%', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
              <Sparkles size={64} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Select a lead to begin AI analysis</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Analyze confidence scores and next best actions.</p>
           </div>
         )}
      </div>

      {/* Overlay Sidebar */}
      <AnimatePresence>
        {selectedLead && (
          <LeadDetailAssistant 
            lead={selectedLead} 
            onClose={() => setSelectedLead(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
