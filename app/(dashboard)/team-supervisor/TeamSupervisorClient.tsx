"use client";

import { useState } from "react";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trophy, 
  ArrowRight,
  RefreshCcw,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Mail,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { getTeamProductivity } from "@/app/actions/aiHub";

interface TeamSupervisorProps {
  initialData: any;
}

export default function TeamSupervisorClient({ initialData }: TeamSupervisorProps) {
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const newData = await getTeamProductivity();
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>Operational Efficiency Monitor</h2>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-outfit)' }}>Team Supervisor</h1>
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
          <span style={{ fontWeight: 800 }}>REFRESH STATS</span>
        </button>
      </header>

      {/* Role Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {Object.entries(data.productivity).map(([role, stats]: [string, any]) => (
          <div key={role} className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>{role} Role</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Real-time productivity tracking</p>
              </div>
              <div style={{ 
                padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900,
                background: stats.overdueCount > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                color: stats.overdueCount > 0 ? '#ef4444' : '#22c55e'
              }}>
                {stats.overdueCount > 0 ? 'INTERVENTION REQ' : 'EFFICIENT'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
               <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{stats.pendingCount}</div>
                 <div style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending</div>
               </div>
               <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#22c55e' }}>{stats.completedCount}</div>
                 <div style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Done</div>
               </div>
               <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ef4444' }}>{stats.overdueCount}</div>
                 <div style={{ fontSize: '0.625rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overdue</div>
               </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
               <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem' }}>RECENT BACKLOG</h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {stats.backlog.map((task: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                       <span style={{ fontWeight: 600 }}>{task.title}</span>
                       <span style={{ fontSize: '0.75rem', color: task.dueDate && new Date(task.dueDate) < new Date() ? '#ef4444' : 'var(--text-muted)' }}>
                         {task.assignedTo}
                       </span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Leaderboard */}
        <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Trophy size={24} color="var(--primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Top Performers</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.leaderboard.map((user: any, i: number) => (
              <div key={i} className="glass" style={{ padding: '1.25rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: 900, color: i === 0 ? 'var(--primary)' : 'var(--text-muted)', width: '20px' }}>{i + 1}</div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                    {user.name[0]}
                  </div>
                  <span style={{ fontWeight: 700 }}>{user.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{user.completed}</div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 800 }}>TASKS COMPLETED</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Warnings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <div className="glass" style={{ padding: '2rem', borderRadius: '24px', background: data.slowResponseWarnings ? 'rgba(239, 68, 68, 0.05)' : 'rgba(34, 197, 94, 0.05)', border: data.slowResponseWarnings ? '1px solid rgba(239, 68, 68, 0.1)' : '1px solid rgba(34, 197, 94, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Zap size={20} color={data.slowResponseWarnings ? '#ef4444' : '#22c55e'} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>AI Performance Alert</h3>
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: data.slowResponseWarnings ? '#ef4444' : '#22c55e' }}>
                {data.slowResponseWarnings ? 'Detected unusual deceleration in task completion metrics for the Sales team. Immediate review recommended.' : 'All team sectors are operating within standard performance parameters.'}
              </p>
           </div>

           <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Sparkles size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Optimization Suggestion</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Based on workload distribution, Emily Editor is nearing capacity. Consider delegating upcoming "Review" tasks to another team member to maintain velocity.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
