"use client";

import { useState } from "react";
import { 
  ArrowLeft, 
  Send, 
  Download, 
  Copy, 
  Zap, 
  CheckCircle2, 
  Save,
  MessageSquare,
  Star
} from "lucide-react";
import Link from "next/link";
import { updateReportStatus } from "@/app/actions/reports";
import { useRouter } from "next/navigation";

interface ReportViewClientProps {
  report: any;
}

export default function ReportViewClient({ report }: ReportViewClientProps) {
  const [wins, setWins] = useState(report.wins || "");
  const [recs, setRecs] = useState(report.recommendations || "");
  const [csat, setCsat] = useState(report.csatScore || 0);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const metrics = report.metrics as any;

  const handleWhatsAppCopy = () => {
    const text = `*Reachly Pro OS - Monthly Performance Summary*%0A%0A` +
      `*Top 3 KPIs:*%0A` +
      `- Total Leads: ${metrics.totalLeads}%0A` +
      `- Conversion Rate: ${metrics.conversionRate}%%0A` +
      `- Tasks Completed: ${metrics.completedTasks}/${metrics.totalTasks}%0A%0A` +
      `*Biggest Win:*%0A${wins.substring(0, 150)}...%0A%0A` +
      `*Recommendation:*%0A${recs.substring(0, 150)}...%0A%0A` +
      `Check your full dashboard for details!`;
    
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleApprove = async () => {
    setIsSaving(true);
    await updateReportStatus(report.id, "Approved");
    router.refresh();
    setIsSaving(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
       {/* Toolbar */}
       <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/reports" className="glass" style={{ padding: '0.5rem', borderRadius: '10px' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>REPORT BUILDER</h2>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>{report.title}</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleWhatsAppCopy} className="glass" style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
             <MessageSquare size={18} color="#22c55e" />
             WhatsApp Summary
          </button>
          <button onClick={() => window.print()} className="glass" style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
             <Download size={18} />
             PDF Export
          </button>
          {report.status === 'Draft' && (
            <button onClick={handleApprove} className="glass" style={{ background: 'var(--primary)', color: '#000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} />
              {isSaving ? 'SAVING...' : 'Approve Report'}
            </button>
          )}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Main Document Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Metrics Grid */}
          <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', background: 'var(--surface)' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
               <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Performance Metrics</h2>
               <p style={{ color: 'var(--text-muted)' }}>{report.client.name} | Snapshot Period</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
               <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-outfit)', color: 'var(--primary)' }}>{metrics.totalLeads}</div>
                 <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Leads Generated</div>
               </div>
               <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-outfit)', color: 'var(--primary)' }}>{metrics.conversionRate}%</div>
                 <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Conv. Rate</div>
               </div>
               <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-outfit)', color: 'var(--primary)' }}>{metrics.completedTasks}</div>
                 <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions Completed</div>
               </div>
            </div>

            {/* Source Breakdown (Mini Chart Table) */}
            <div style={{ marginTop: '3rem' }}>
               <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-muted)' }}>LEAD SOURCE BREAKDOWN</h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Object.entries(metrics.sourceBreakdown || {}).map(([source, count]: [string, any]) => (
                    <div key={source}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        <span>{source}</span>
                        <span style={{ fontWeight: 700 }}>{count}</span>
                      </div>
                      <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                        <div style={{ height: '100%', background: 'var(--primary)', borderRadius: '3px', width: `${((count as number) / metrics.totalLeads) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* AI Insights & Text */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
             <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Zap size={20} color="var(--primary)" />
                  <h3 style={{ fontWeight: 700 }}>Wins this Month</h3>
                </div>
                <textarea 
                  value={wins}
                  disabled={report.status !== 'Draft'}
                  onChange={(e) => setWins(e.target.value)}
                  style={{ width: '100%', minHeight: '120px', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.875rem', lineHeight: 1.6, outline: 'none', resize: 'none' }}
                />
             </div>
             <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <Sparkles size={20} color="var(--primary)" />
                  <h3 style={{ fontWeight: 700 }}>Strategic Recommendations</h3>
                </div>
                <textarea 
                  value={recs}
                  disabled={report.status !== 'Draft'}
                  onChange={(e) => setRecs(e.target.value)}
                  style={{ width: '100%', minHeight: '120px', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.875rem', lineHeight: 1.6, outline: 'none', resize: 'none' }}
                />
             </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Agency Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                 <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>CLIENT SATISFACTION (CSAT)</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                       {[1,2,3,4,5].map(star => (
                         <button 
                           key={star} 
                           onClick={() => setCsat(star)}
                           style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                         >
                           <Star size={24} fill={star <= csat ? 'var(--primary)' : 'none'} color={star <= csat ? 'var(--primary)' : 'var(--text-muted)'} />
                         </button>
                       ))}
                    </div>
                 </div>
                 <button 
                   onClick={() => updateReportStatus(report.id, report.status, csat)} 
                   className="glass" 
                   style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600, border: '1px solid var(--primary)', color: 'var(--primary)' }}
                 >
                   Save Analytics
                 </button>
              </div>
           </div>

           <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Export Checklist</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: metrics.totalLeads > 0 ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Check size={12} color="#000" />
                    </div>
                    Data Aggregated
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: wins.length > 20 ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Check size={12} color="#000" />
                    </div>
                    Insights Added
                 </div>
              </div>
           </div>
        </aside>
      </div>

      <style jsx global>{`
        @media print {
          .glass { border: 1px solid #ccc !important; background: #fff !important; color: #000 !important; }
          button, header, aside { display: none !important; }
          div[style*="grid-template-columns: 1fr 350px"] { grid-template-columns: 1fr !important; }
          body { background: #fff !important; color: #000 !important; }
        }
      `}</style>
    </div>
  );
}

// Sparkles import fix
import { Sparkles, Check } from "lucide-react";
