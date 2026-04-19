"use client";

import { 
  Zap, 
  MessageSquare, 
  ChevronRight, 
  Send, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Copy,
  User,
  Sparkles,
  ShieldCheck,
  Target
} from "lucide-react";
import { useState, useEffect } from "react";
import { logOutreachActivity, getLeadSalesIntelligence } from "@/app/actions/aiHub";
import { motion, AnimatePresence } from "framer-motion";

interface Lead {
  id: string;
  name: string;
  company: string | null;
  status: string;
  aiScore: number;
  temperature: string;
  activities: any[];
}

interface LeadDetailAssistantProps {
  lead: Lead | null;
  onClose: () => void;
}

export default function LeadDetailAssistant({ lead, onClose }: LeadDetailAssistantProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'assistant' | 'templates'>('assistant');
  const [isSending, setIsSending] = useState(false);
  const [intel, setIntel] = useState<any>(null);
  const [loadingIntel, setLoadingIntel] = useState(false);

  useEffect(() => {
    if (lead) {
      loadIntelligence();
    }
  }, [lead?.id]);

  const loadIntelligence = async () => {
    if (!lead) return;
    setLoadingIntel(true);
    try {
      const result = await getLeadSalesIntelligence(lead.id);
      setIntel(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingIntel(false);
    }
  };

  if (!lead) return null;

  const objections = [
    { label: "Too Expensive", reply: "I totally understand pricing is a factor. However, our AI growth systems typically generate a 3-5x ROI within 90 days, effectively making the system pay for itself. Would you like to see a breakdown of the specific cost-vs-revenue models we've built for similar agencies?" },
    { label: "Already Has Agency", reply: "That's great! Most of our best partners actually already have an agency for standard tasks. We specialize specifically in AI-driven automation and high-intent lead systems that sit on top of your current setup to boost performance. Can I show you how we integrate?" },
    { label: "Don't Have Time", reply: "That's exactly why we built this. Our system is 'Done-For-You' specifically to free up 10-15 hours of your week. If we could automate your lead intake and qualify them while you sleep, would that 20min call be worth it next week?" },
    { label: "Need to Think", reply: "Totally fair. Decision-making is key. To help with that 'thinking' phase, I can send over 2 case studies of companies exactly like yours that were in the same position last month. Does that help?" },
    { label: "Send Details", reply: "Absolutely! I'm sending over our 'Reachly Alpha' breakdown right now. To ensure I include the most relevant data, are you currently more focused on Lead Generation or Operational Automation?" },
    { label: "Not Interested", reply: "No problem at all! I appreciate the honesty. I'll move you to our newsletter list for now. If you ever find your current lead flow slowing down, we're here to help. Best of luck!" },
  ];

  const handleSendTemplate = async (content: string) => {
    setIsSending(true);
    await logOutreachActivity(lead.id, `AI TEMPLATE SENT: ${content}`);
    navigator.clipboard.writeText(content);
    setIsSending(false);
    alert("Template copied to clipboard and outreach logged!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="glass"
      style={{
        position: 'fixed', top: 0, right: 0, height: '100%', width: '450px',
        background: 'var(--surface)', borderLeft: '1px solid var(--border)',
        zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{lead.name}</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{lead.company || 'Unknown Company'}</p>
          </div>
          <button onClick={onClose} className="glass" style={{ padding: '0.5rem', borderRadius: '10px' }}>
            <ChevronRight size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
           <div className="glass" style={{ flex: 1, padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>{lead.aiScore}</div>
              <div style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-muted)' }}>AI SCORE</div>
           </div>
           <div className="glass" style={{ flex: 1, padding: '1rem', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: lead.temperature === 'Hot' ? '#ef4444' : 'var(--primary)' }}>{lead.temperature}</div>
              <div style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-muted)' }}>TEMPERATURE</div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => setActiveTab('assistant')}
          style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', color: activeTab === 'assistant' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700, borderBottom: activeTab === 'assistant' ? '2px solid var(--primary)' : 'none', cursor: 'pointer' }}
        >
          AI Sales Assistant
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', color: activeTab === 'chat' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700, borderBottom: activeTab === 'chat' ? '2px solid var(--primary)' : 'none', cursor: 'pointer' }}
        >
          History
        </button>
        <button 
          onClick={() => setActiveTab('templates')}
          style={{ flex: 1, padding: '1rem', background: 'none', border: 'none', color: activeTab === 'templates' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700, borderBottom: activeTab === 'templates' ? '2px solid var(--primary)' : 'none', cursor: 'pointer' }}
        >
          Objections
        </button>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'assistant' && (
            <motion.div 
              key="assistant"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              {loadingIntel ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <Sparkles size={32} className="spin" color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ color: 'var(--text-muted)' }}>Analyzing lead data...</p>
                </div>
              ) : intel ? (
                <>
                  <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(250, 204, 21, 0.1)', background: 'rgba(250, 204, 21, 0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <Zap size={18} color="var(--primary)" />
                      <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Suggested Reply</h4>
                    </div>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{intel.suggestedReply}</p>
                    <button 
                      onClick={() => handleSendTemplate(intel.suggestedReply)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'var(--primary)', color: '#000', border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <Copy size={14} /> COPY & LOG OUTREACH
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="glass" style={{ padding: '1.25rem', borderRadius: '16px' }}>
                      <div style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}><ShieldCheck size={18} /></div>
                      <div style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Best Offer</div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{intel.bestOffer}</div>
                    </div>
                    <div className="glass" style={{ padding: '1.25rem', borderRadius: '16px' }}>
                      <div style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}><Clock size={18} /></div>
                      <div style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Follow-up</div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{intel.followUpTiming}</div>
                    </div>
                  </div>

                  <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <Target size={18} color="var(--primary)" />
                      <h4 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Next Best Action</h4>
                    </div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{intel.nextAction}</p>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <AlertCircle size={32} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
                  <p style={{ color: 'var(--text-muted)' }}>Failed to load intelligence.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
               {lead.activities?.length > 0 ? lead.activities.map((act: any) => (
                  <div key={act.id} className="glass" style={{ padding: '1rem', borderRadius: '14px', background: act.type === 'Email' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(255,255,255,0.02)' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{act.type.toUpperCase()}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{new Date(act.date).toLocaleDateString()}</span>
                     </div>
                     <div style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{act.content}</div>
                  </div>
               )) : (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                     <Clock size={32} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                     <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No outreach history found.</p>
                  </div>
               )}
            </motion.div>
          )}

          {activeTab === 'templates' && (
            <motion.div 
              key="templates"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
               <div className="glass" style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(202, 138, 4, 0.05)', border: '1px solid rgba(202, 138, 4, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                     <Sparkles size={16} color="var(--primary)" />
                     <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>QUICK OBJECTION HANDLERS</span>
                  </div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                 {objections.map((obj) => (
                   <button 
                     key={obj.label}
                     onClick={() => handleSendTemplate(obj.reply)}
                     className="glass card-hover"
                     style={{ 
                       padding: '1rem', borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
                       display: 'flex', flexDirection: 'column', gap: '0.5rem', border: '1px solid var(--border)'
                     }}
                   >
                     <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>{obj.label}</span>
                     <Copy size={14} style={{ opacity: 0.5 }} />
                   </button>
                 ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Quick Reply */}
      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
         <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '12px' }}>
            <MessageSquare size={18} color="var(--text-muted)" />
            <input type="text" placeholder="Type quick response..." style={{ background: 'none', border: 'none', flex: 1, color: '#fff', outline: 'none' }} />
            <button style={{ background: 'var(--primary)', color: '#000', border: 'none', borderRadius: '6px', padding: '0.25rem 0.5rem' }}>
               <Send size={14} />
            </button>
         </div>
      </div>
    </motion.div>
  );
}
