"use client";

import { 
  Building2, 
  Clock, 
  AlertCircle,
  MoreHorizontal,
  Plus
} from "lucide-react";

interface KanbanViewProps {
  tasks: any[];
}

export default function KanbanView({ tasks }: KanbanViewProps) {
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
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <Plus size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tasks.filter(t => t.status === column.id).map((task) => {
              const overdue = isOverdue(task.dueDate) && task.status !== 'Completed';
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
                    cursor: 'grab'
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
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                  
                  <h4 style={{ fontSize: '0.925rem', fontWeight: 600, marginBottom: '0.75rem', lineHeight: 1.4 }}>
                    {task.title}
                  </h4>

                  {task.client && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <Building2 size={12} />
                      {task.client.name}
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
