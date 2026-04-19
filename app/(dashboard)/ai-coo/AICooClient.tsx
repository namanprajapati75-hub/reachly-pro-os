"use client";

import { useState, useEffect } from "react";
import { 
  Zap, 
  AlertCircle, 
  Target, 
  Clock, 
  TrendingUp, 
  FileText, 
  ArrowRight,
  RefreshCcw,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAICOOBriefing } from "@/app/actions/aiHub";

interface AICooProps {
  initialData: any;
}

export default function AICooClient({ initialData }: AICooProps) {
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const newData = await getAICOOBriefing();
      setData(newData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const categories = [
    { id: 'urgent', title: 'Urgent Tasks', icon: <AlertCircle size={20} color="#ef4444" />, count: data.urgentTasks.length, items: data.urgentTasks },
    { id: 'overdue', title: 'Overdue Tasks', icon: <Clock size={20} color="#ef4444" />, count: data.overdueTasks.length, items: data.overdueTasks },
    { id: 'hot', title: 'Hot Leads', icon: <Zap size={20} color="var(--primary)" />, count: data.hotLeads.length, items: data.hotLeads },
    { id: 'ignored', title: 'Ignored Leads', icon: <Clock size={20} color="#facc15" />, count: data.ignoredLeads.length, items: data.ignoredLeads },
    { id: 'risk', title: 'Client Risks', icon: <AlertCircle size={20} color="#ef4444" />, count: data.atRiskClients.length, items: data.atRiskClients },
    { id: 'reports', title: 'Reports Due', icon: <FileText size={20} color="var(--primary)" />, count: data.reportsDue.length, items: data.reportsDue },
    { id: 'revenue', title: 'Revenue Ops', icon: <TrendingUp size={20} color="var(--primary)" />, count: `$${data.revenueOpportunities.toLocaleString()}`, items: [] },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>Operations Command Center</h2>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-outfit)' }}>AI COO Intelligence</h1>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="glass btn-hover"
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.75rem', 
            padding: '0.75rem 1.5rem', borderRadius: '12px',
            border: 'none', cursor: 'pointer', opacity: isRefreshing ? 0.5 : 1
          }}
        >
          <RefreshCcw size={18} className={isRefreshing ? 'spin' : ''} />
          <span style={{ fontWeight: 800 }}>REFRESH BRIEFING</span>
        </button>
      </header>

      {/* Founder Briefing Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{ 
          padding: '2.5rem', borderRadius: '24px', 
          background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.05) 0%, rgba(202, 138, 4, 0.01) 100%)',
          border: '1px solid rgba(250, 204, 21, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Sparkles size={24} color="var(--primary)" />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Morning Strategic Briefing</h3>
        </div>
        <p style={{ fontSize: '1.25rem', lineHeight: 1.7, fontWeight: 500, color: '#fff' }}>
          {isRefreshing ? 'AI is analyzing your agency operations...' : data.briefing}
        </p>
      </motion.div>

      {/* Grid of Actionable Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="glass card-hover" 
            style={{ 
              padding: '1.5rem', borderRadius: '24px', 
              cursor: cat.items.length > 0 ? 'pointer' : 'default',
              border: activeCategory === cat.id ? '1px solid var(--primary)' : '1px solid var(--border)'
            }}
            onClick={() => cat.items.length > 0 && setActiveCategory(activeCategory === cat.id ? null : cat.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cat.icon}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{cat.count}</div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>{cat.title}</h4>
              {cat.items.length > 0 && (
                activeCategory === cat.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />
              )}
            </div>

            <AnimatePresence>
              {activeCategory === cat.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cat.items.map((item: any, idx: number) => (
                      <div key={idx} style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', fontSize: '0.875rem' }}>
                        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{item.title || item.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {item.client?.company || item.company || 'Operations'}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Top 5 Recommended Actions */}
      <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '2rem' }}>Top Strategic Recommendations</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           {[
             { action: `Contact ${data.hotLeads[0]?.name || 'Harvey Specter'} immediately - 95% close probability.`, type: 'GROWTH' },
             { action: `Resolve overdue tasks for ${data.overdueTasks[0]?.client?.company || 'Nexus Digital'} to prevent churn.`, type: 'RETENTION' },
             { action: `Complete draft report for Isabella Vance - due in 24 hours.`, type: 'OPS' },
             { action: `Address low CSAT score for Viktor Drago campaign intervention.`, type: 'RISK' },
             { action: `Follow up with ${data.ignoredLeads.length} leads that haven't been touched in 7+ days.`, type: 'PIPE' }
           ].map((rec, i) => (
             <div key={i} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
               <div style={{ 
                 padding: '4px 10px', borderRadius: '6px', fontSize: '0.625rem', fontWeight: 900, 
                 background: rec.type === 'GROWTH' ? 'rgba(34, 197, 94, 0.1)' : rec.type === 'RISK' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(250, 204, 21, 0.1)',
                 color: rec.type === 'GROWTH' ? '#22c55e' : rec.type === 'RISK' ? '#ef4444' : 'var(--primary)'
               }}>
                 {rec.type}
               </div>
               <p style={{ flex: 1, fontWeight: 600 }}>{rec.action}</p>
               <ArrowRight size={18} color="var(--text-muted)" />
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
