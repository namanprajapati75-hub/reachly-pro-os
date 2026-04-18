"use client";

import { useState } from "react";
import { 
  Building2, 
  Clock, 
  AlertCircle,
  MoreHorizontal,
  Plus,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { updateTask } from "@/app/actions/tasks";
import { useToast } from "@/app/components/ui/ToastProvider";

interface KanbanViewProps {
  tasks: any[];
  onEdit: (task: any) => void;
}

export default function KanbanView({ tasks, onEdit }: KanbanViewProps) {
  const { addToast } = useToast();
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);
  
  const columns = [
    { id: 'Open', label: 'Open' },
    { id: 'In_Progress', label: 'In Progress' },
    { id: 'Waiting_Client', label: 'Waiting Client' },
    { id: 'Completed', label: 'Completed' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return '#ef4444';
      case 'High': return '#f59e0b';
      case 'Medium': return '#3b82f6';
      default: return 'var(--text-muted)';
    }
  };

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
    <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem', minHeight: '600px' }}>
      {columns.map((column) => (
        <div key={column.id} style={{ minWidth: '320px', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {column.label} 
                <span style={{ marginLeft: '0.5rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                  ({tasks.filter(t => t.status === column.id).length})
                </span>
              </h3>
            </div>
            <button onClick={() => onEdit(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <Plus size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tasks.filter(t => t.status === column.id).map((task) => {
              const overdue = isOverdue(task.dueDate) && task.status !== 'Completed';
              const isSubmitting = loadingTaskId === task.id;
              
              return (
                <div 
                  key={task.id} 
                  className="glass" 
                  style={{ 
                    padding: '1.25rem', 
                    borderRadius: '16px', 
                    border: overdue ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border)',
                    boxShadow: overdue ? '0 0 15px rgba(239, 68, 68, 0.1)' : 'none',
                    background: overdue ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(15, 15, 15, 1) 100%)' : 'rgba(255,255,255,0.02)',
                    cursor: 'grab',
                    opacity: task.status === 'Completed' ? 0.6 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ 
                      fontSize: '0.625rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px',
                      background: `${getPriorityColor(task.priority)}20`,
                      color: getPriorityColor(task.priority),
                      textTransform: 'uppercase'
                    }}>
                      {task.priority}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {task.status !== 'Completed' && (
                        <button 
                          onClick={() => handleMarkComplete(task)} 
                          disabled={isSubmitting}
                          style={{ background: 'none', border: 'none', color: '#22c55e', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.5 : 1 }} 
                          title="Mark Complete"
                        >
                          {isSubmitting ? <Loader2 size={16} className="spinner" /> : <CheckCircle2 size={16} />}
                        </button>
                      )}
                      <button onClick={() => onEdit(task)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <h4 style={{ fontSize: '0.925rem', fontWeight: 600, marginBottom: '0.75rem', lineHeight: 1.4, textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>
                    {task.title}
                  </h4>

                  {task.client && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <Building2 size={12} />
                      {task.client.company || task.client.name}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem',
                      color: overdue ? '#ef4444' : 'var(--text-muted)',
                      fontWeight: overdue ? 700 : 400
                    }}>
                      {overdue ? <AlertCircle size={12} /> : <Clock size={12} />}
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </div>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      AS
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
