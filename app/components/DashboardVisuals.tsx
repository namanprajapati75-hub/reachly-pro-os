"use client";

import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart2, ArrowUpRight } from 'lucide-react';

const PIPELINE_COLORS = ['#22d3a3', '#f5c842', '#f59e0b', '#4f8ef7', '#a78bfa'];

const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border-medium)',
        borderRadius: '10px',
        padding: '0.75rem 1rem',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--foreground-subtle)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
        <p style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border-medium)',
        borderRadius: '10px',
        padding: '0.75rem 1rem',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--foreground-subtle)', marginBottom: '4px' }}>{label}</p>
        <p style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--accent-blue)', fontFamily: 'var(--font-display)' }}>
          {payload[0].value} msgs
        </p>
      </div>
    );
  }
  return null;
};

interface DashboardVisualsProps {
  chartData: any[];
  pieData: any[];
  totalLeads: number;
}

const outreachData = [
  { name: 'Mon', msgs: 42 },
  { name: 'Tue', msgs: 68 },
  { name: 'Wed', msgs: 55 },
  { name: 'Thu', msgs: 91 },
  { name: 'Fri', msgs: 73 },
  { name: 'Sat', msgs: 38 },
  { name: 'Sun', msgs: 47 },
];

export default function DashboardVisuals({ chartData, pieData, totalLeads }: DashboardVisualsProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
      {/* Revenue Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="premium-card"
        style={{ padding: '1.75rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
              Revenue Velocity
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              Weekly Growth
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            padding: '4px 10px', borderRadius: '6px',
            background: 'var(--accent-green-dim)',
            color: 'var(--accent-green)',
            fontSize: '0.75rem', fontWeight: 700,
          }}>
            <TrendingUp size={12} />
            +24.5%
          </div>
        </div>
        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--foreground-subtle)', fontSize: 11, fontWeight: 600 }}
                dy={8}
              />
              <YAxis hide />
              <Tooltip content={<CustomAreaTooltip />} cursor={{ stroke: 'var(--border-medium)', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGrad)"
                animationDuration={1500}
                dot={false}
                activeDot={{ r: 5, fill: 'var(--primary)', stroke: 'var(--background)', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Outreach Performance Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="premium-card"
        style={{ padding: '1.75rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
              Outreach Performance
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              Messages Sent
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            padding: '4px 10px', borderRadius: '6px',
            background: 'var(--accent-blue-dim)',
            color: 'var(--accent-blue)',
            fontSize: '0.75rem', fontWeight: 700,
          }}>
            <BarChart2 size={12} />
            This Week
          </div>
        </div>
        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={outreachData} barSize={22} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--foreground-subtle)', fontSize: 11, fontWeight: 600 }}
                dy={8}
              />
              <YAxis hide />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(79, 142, 247, 0.05)' }} />
              <Bar dataKey="msgs" radius={[5, 5, 0, 0]} animationDuration={1200}>
                {outreachData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={index === 3 ? 'var(--accent-blue)' : 'rgba(79, 142, 247, 0.4)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Pipeline Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="premium-card"
        style={{ padding: '1.75rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
              Pipeline Sources
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              Lead Distribution
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--primary)', letterSpacing: '-0.03em' }}>{totalLeads}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--foreground-subtle)', fontWeight: 600 }}>TOTAL</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {pieData.length > 0 ? pieData.slice(0, 5).map((entry, i) => {
            const pct = totalLeads > 0 ? Math.round((entry.value / totalLeads) * 100) : 0;
            return (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: PIPELINE_COLORS[i % PIPELINE_COLORS.length], flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>{entry.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{entry.value}</span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--foreground-subtle)' }}>{pct}%</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    style={{ height: '100%', borderRadius: 'var(--radius-full)', background: PIPELINE_COLORS[i % PIPELINE_COLORS.length] }}
                  />
                </div>
              </div>
            );
          }) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--foreground-subtle)', fontSize: '0.8125rem' }}>
              No pipeline data yet
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
