"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "framer-motion";
import { Filter, Sparkles } from "lucide-react";

const COLORS = ['#facc15', '#eab308', '#ca8a04', '#a16207'];

interface DashboardVisualsProps {
  chartData: any[];
  pieData: any[];
  totalLeads: number;
}

export default function DashboardVisuals({ chartData, pieData, totalLeads }: DashboardVisualsProps) {
  return (
    <>
      <section style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass" 
          style={{ flex: 2, minWidth: '400px', padding: '2rem', borderRadius: '24px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Revenue Growth</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Real-time agency performance</p>
            </div>
            <button className="glass" style={{ padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
              <Filter size={18} />
            </button>
          </div>
          
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--surface)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '12px',
                    color: '#fff' 
                  }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="glass" 
          style={{ flex: 1, minWidth: '300px', padding: '2rem', borderRadius: '24px' }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '2rem' }}>Leads by Source</h3>
          <div style={{ height: '240px', width: '100%', position: 'relative' }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No lead data yet
              </div>
            )}
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalLeads}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total</p>
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {pieData.map((item, i) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                <span style={{ color: 'var(--text-muted)' }}>{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* AI Hub Preview Widget */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass" 
        style={{ 
          padding: '2rem', 
          borderRadius: '24px', 
          background: 'linear-gradient(90deg, rgba(250, 204, 21, 0.05) 0%, rgba(15, 15, 15, 1) 100%)',
          border: '1px solid rgba(250, 204, 21, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Sparkles size={24} color="var(--primary)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Intelligence Engine</h3>
        </div>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: '1.6' }}>
              We've analyzed your {totalLeads} leads. {pieData.length > 0 ? (
                `Currently, ${pieData[0]?.name} is your most productive channel. We recommend increasing optimization on this source for higher conversion velocity.`
              ) : (
                "Once you add more leads, our AI engine will start providing growth recommendations based on your unique acquisition channels."
              )}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ 
              background: 'var(--primary)', 
              color: '#000', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '12px', 
              fontWeight: 700,
              cursor: 'pointer'
            }}>
              Generate Report
            </button>
          </div>
        </div>
      </motion.section>
    </>
  );
}
