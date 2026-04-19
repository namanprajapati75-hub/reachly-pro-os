"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertCircle, 
  Zap, 
  DollarSign, 
  ArrowUpRight,
  RefreshCcw,
  Sparkles,
  BarChart3,
  Search
} from "lucide-react";
import { motion } from "framer-motion";
import { getRevenueIntelligence } from "@/app/actions/aiHub";

interface RevenueBrainProps {
  initialData: any;
}

export default function RevenueBrainClient({ initialData }: RevenueBrainProps) {
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const newData = await getRevenueIntelligence();
      setData(newData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>Financial Growth Engine</h2>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-outfit)' }}>Revenue Intelligence</h1>
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
          <span style={{ fontWeight: 800 }}>REFRESH ANALYSIS</span>
        </button>
      </header>

      {/* Hero KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Monthly Revenue Forecast</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)' }}>${data.monthlyForecast.toLocaleString()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: '#22c55e', fontSize: '0.875rem', fontWeight: 700 }}>
             <TrendingUp size={16} />
             +12.4% vs last month
          </div>
          <DollarSign size={80} style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.05 }} />
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Revenue Leaks (Detected)</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ef4444' }}>-${data.revenueLeaks.potentialLoss.toLocaleString()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
             {data.revenueLeaks.ignoredLeadsCount} ignored leads • {data.revenueLeaks.overdueTasksCount} overdue tasks
          </div>
          <TrendingDown size={80} style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.05 }} />
        </div>
      </div>

      {/* AI Revenue Strategic Recommendation */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '24px', background: 'rgba(250, 204, 21, 0.05)', border: '1px solid rgba(250, 204, 21, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Sparkles size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em' }}>STRATEGIC AI RECOMMENDATION</h3>
        </div>
        <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>
          "{data.aiRecommendation}"
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Upsell Opportunities */}
          <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <Zap size={24} color="var(--primary)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Upsell Opportunities</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.upsellCandidates.length > 0 ? data.upsellCandidates.map((client: any, i: number) => (
                <div key={i} className="glass btn-hover" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.125rem' }}>{client.company}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Premium Partner • ${client.revenue.toLocaleString()}/yr
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800 }}>
                      SUGGEST WEBSITE UPSELL
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              )) : (
                <p style={{ color: 'var(--text-muted)' }}>No high-probability upsells detected today.</p>
              )}
            </div>
          </div>

          {/* Churn Risk */}
          <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <AlertCircle size={24} color="#ef4444" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Churn Risk Protection</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.churnRisks.length > 0 ? data.churnRisks.map((client: any, i: number) => (
                <div key={i} className="glass btn-hover" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.125rem' }}>{client.company}</div>
                    <div style={{ fontSize: '0.875rem', color: '#ef4444', fontWeight: 600, marginTop: '0.25rem' }}>
                      Warning: Low CSAT Detected
                    </div>
                  </div>
                  <button className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    URGENT RETENTION CALL
                  </button>
                </div>
              )) : (
                <p style={{ color: 'var(--text-muted)' }}>Retention metrics are currently stable.</p>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* High Value Leads */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Target size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>High Value Pipeline</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.highestValueLeads.map((lead: any, i: number) => (
                <div key={i} className="glass" style={{ padding: '1rem', borderRadius: '16px' }}>
                  <div style={{ fontWeight: 700 }}>{lead.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lead.company}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 900, color: 'var(--primary)' }}>{lead.aiScore}%</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>EST: $5,000</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Forecast Analysis */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <BarChart3 size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Forecast breakdown</h3>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              AI predicts a <span style={{ color: 'var(--primary)', fontWeight: 700 }}>$${(data.monthlyForecast * 12).toLocaleString()}</span> annual run rate based on current conversion velocity and retention patterns.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
