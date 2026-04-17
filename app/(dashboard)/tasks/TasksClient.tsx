"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  List, 
  LayoutGrid, 
  Filter 
} from "lucide-react";
import ListView from "@/app/components/features/tasks/ListView";
import KanbanView from "@/app/components/features/tasks/KanbanView";

interface TasksClientProps {
  tasks: any[];
}

export default function TasksClient({ tasks }: TasksClientProps) {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>Operations</h2>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>Task Command Center</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass" style={{ display: 'flex', padding: '4px', borderRadius: '12px' }}>
            <button 
              onClick={() => setView('list')}
              style={{ 
                padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: view === 'list' ? 'var(--primary)' : 'transparent',
                color: view === 'list' ? '#000' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              <List size={18} />
              List
            </button>
            <button 
              onClick={() => setView('kanban')}
              style={{ 
                padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: view === 'kanban' ? 'var(--primary)' : 'transparent',
                color: view === 'kanban' ? '#000' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              <LayoutGrid size={18} />
              Board
            </button>
          </div>
          <button className="glass" style={{ 
            background: 'var(--primary)', color: '#000', border: 'none', 
            padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
          }}>
            <Plus size={18} />
            Create Task
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div className="glass" style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem',
          borderRadius: '12px', flex: 1, maxWidth: '400px'
        }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search tasks, descriptions, or clients..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'none', border: 'none', width: '100%', color: '#fff', outline: 'none' }}
          />
        </div>
        <button className="glass" style={{ padding: '0.625rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <Filter size={18} />
          Priority
        </button>
      </div>

      {/* Dynamic View */}
      {view === 'list' ? (
        <ListView tasks={tasks} searchQuery={searchQuery} />
      ) : (
        <KanbanView tasks={tasks} />
      )}
    </div>
  );
}
