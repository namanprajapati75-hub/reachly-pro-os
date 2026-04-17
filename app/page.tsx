"use client";

import { 
  TrendingUp, 
  Users, 
  Target, 
  Clock, 
  Zap, 
  Filter,
  MoreHorizontal,
  Sparkles
} from "lucide-react";
import DashboardCard from "./components/DashboardCard";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "framer-motion";

const data = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const pieData = [
  { name: 'Meta Ads', value: 400 },
  { name: 'Google Ads', value: 300 },
  { name: 'Organic', value: 300 },
  { name: 'Referral', value: 200 },
];

const COLORS = ['#facc15', '#eab308', '#ca8a04', '#a16207'];

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>Welcome back, Adhish</h2>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>Project Overview</h1>
      </header>

      {/* KPI Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <DashboardCard 
          title="Total Revenue" 
          value="$128,430" 
          change="+12.5%" 
          isPositive={true} 
          icon={<TrendingUp size={20} />} 
          delay={0.1}
        />
        <DashboardCard 
          title="Active Leads" 
          value="842" 
          change="+8.2%" 
          isPositive={true} 
          icon={<Target size={20} />} 
          delay={0.2}
        />
        <DashboardCard 
          title="New Clients" 
          value="12" 
          change="-2.4%" 
          isPositive={false} 
          icon={<Users size={20} />} 
          delay={0.3}
        />
        <DashboardCard 
          title="Avg. Response Time" 
          value="4.2h" 
          change="+5.0%" 
          isPositive={true} 
          icon={<Clock size={20} />} 
          delay={0.4}
        />
      </section>

      {/* Charts Section */}
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
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Daily performance overview</p>
            </div>
            <button className="glass" style={{ padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
              <Filter size={18} />
            </button>
          </div>
          
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
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
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>842</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Leads</p>
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {pieData.map((item, i) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i] }} />
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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Performance Insights</h3>
        </div>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', lineHeight: '1.6' }}>
              Your Google Ads campaigns are performing <strong>22% better</strong> than last week. 
              We suggest increasing the budget for the "Real Estate SEO" lead magnet to capitalize on the lower CPL.
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
              Execute Optimization
            </button>
            <button className="glass" style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '12px', 
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              Dismiss
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

