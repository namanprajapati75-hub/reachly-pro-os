"use client";

import { AlertCircle, Zap, Building2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface PriorityTask {
  id: string;
  title: string;
  priority: string;
  client?: { name: string };
  dueDate: string | null;
}

interface TodayPrioritiesWidgetProps {
  tasks: PriorityTask[];
}

export default function TodayPrioritiesWidget({ tasks }: TodayPrioritiesWidgetProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass" 
      style={{ padding: '2rem', borderRadius: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Zap size={22} color="var(--primary)" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Critical Actions</h3>
        </div>
        <Link href="/tasks" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          COMMAND CENTER <ChevronRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.length > 0 ? tasks.map((task) => (
          <div key={task.id} className="glass" style={{ 
            padding: '1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.02)',
            display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `3px solid ${task.priority === 'Urgent' ? '#ef4444' : '#f59e0b'}`
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>{task.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                <Building2 size={12} />
                {task.client?.name || 'Internal'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontSize: '0.625rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px',
                background: task.priority === 'Urgent' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                color: task.priority === 'Urgent' ? '#ef4444' : '#f59e0b'
              }}>
                {task.priority.toUpperCase()}
              </div>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No mission-critical tasks for today.
          </div>
        )}
      </div>
    </motion.div>
  );
}
