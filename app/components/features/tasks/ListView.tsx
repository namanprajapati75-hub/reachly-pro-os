"use client";

import { useState } from "react";
import { 
  Clock, 
  MoreHorizontal, 
  AlertCircle, 
  Building2,
  Calendar,
  CheckCircle2,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { updateTask } from "@/app/actions/tasks";
import { useToast } from "@/app/components/ui/ToastProvider";

interface ListViewProps {
  tasks: any[];
  onEdit: (task: any) => void;
}

export default function ListView({ tasks, onEdit }: ListViewProps) {
  const { addToast } = useToast();
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);

  const isOverdue = (date: string | null) => {
    if (!date) return false;
    return new Date(date) < new Date() && new Date(date).toDateString() !== new Date().toDateString();
  };

  const handleMarkComplete = async (task: any) => {
    setLoadingTaskId(task.id);
    try {
      const res = await updateTask(task.id, { status: 'Completed' });
      if (res.success) {
        addToast("Task marked as complete!", "success");
      } else {
        addToast("Failed to complete task.", "error");
      }
    } catch {
      addToast("Error completing task.", "error");
    } finally {
      setLoadingTaskId(null);
    }
  };

  return (
    <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>TASK</th>
            <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>CLIENT</th>
            <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>PRIORITY</th>
            <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>STATUS</th>
            <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>DUE DATE</th>
            <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate) && task.status !== 'Completed';
            const isSubmitting = loadingTaskId === task.id;
            
            return (
              <tr key={task.id} className="table-row" style={{ 
                borderBottom: '1px solid var(--border)',
                boxShadow: overdue ? 'inset 4px 0 0 #ef4444' : 'none',
                background: overdue ? 'rgba(239, 68, 68, 0.02)' : 'transparent',
                opacity: task.status === 'Completed' ? 0.6 : 1
              }}>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>
                    {task.title}
                    {overdue && <AlertCircle size={14} color="#ef4444" />}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  {task.client ? (
                    <Link href={`/clients/${task.client.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--primary)' }}>
                      <Building2 size={16} />
                      {task.client.company || task.client.name}
                    </Link>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Internal</span>
                  )}
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <span style={{ 
                    padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                    background: task.priority === 'Urgent' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
                    color: task.priority === 'Urgent' ? '#ef4444' : 'var(--text-muted)'
                  }}>
                    {task.priority}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <div style={{ 
                      width: '8px', height: '8px', borderRadius: '50%', 
                      background: task.status === 'Completed' ? '#22c55e' : 'var(--primary)' 
                    }} />
                    {task.status.replace('_', ' ')}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem',
                    color: overdue ? '#ef4444' : 'var(--text-muted)'
                  }}>
                    <Calendar size={14} />
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                   <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                     {task.status !== 'Completed' && (
                       <button 
                         onClick={() => handleMarkComplete(task)} 
                         disabled={isSubmitting}
                         className="glass btn-hover" 
                         style={{ padding: '0.5rem', borderRadius: '8px', color: '#22c55e', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.5 : 1 }} 
                         title="Mark Complete"
                       >
                        {isSubmitting ? <Loader2 size={16} className="spinner" /> : <CheckCircle2 size={16} />}
                       </button>
                     )}
                     <button onClick={() => onEdit(task)} className="glass" style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      <MoreHorizontal size={16} />
                     </button>
                   </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
