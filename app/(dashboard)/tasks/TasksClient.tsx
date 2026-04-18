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

import { motion, AnimatePresence } from "framer-motion";
import PremiumEmptyState from "@/app/components/ui/PremiumEmptyState";
import { CheckSquare } from "lucide-react";
import TaskModal from "@/app/components/features/tasks/TaskModal";

interface TasksClientProps {
  tasks: any[];
  clients: any[];
}

export default function TasksClient({ tasks, clients }: TasksClientProps) {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.client?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

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
              className={view === 'list' ? '' : 'btn-hover'}
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
              className={view === 'kanban' ? '' : 'btn-hover'}
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
          <button onClick={handleCreate} className="glass btn-hover" style={{ 
            background: 'var(--primary)', color: '#000', border: 'none', 
            padding: '0.75rem 1.75rem', borderRadius: '12px', fontWeight: 800,
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
          }}>
            <Plus size={18} />
            Create Task
          </button>
        </div>
      </header>

      {tasks.length > 0 ? (
        <>
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
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {view === 'list' ? (
                <ListView tasks={filteredTasks} onEdit={handleEdit} />
              ) : (
                <KanbanView tasks={filteredTasks} onEdit={handleEdit} />
              )}
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <PremiumEmptyState 
          icon={<CheckSquare />}
          title="Zero Tasks Pending"
          description={tasks.length === 0 ? "Everything is covered. Your operations are currently in a perfect state. Use the 'Create Task' button to define new goals or client deliverables." : "No tasks match your search."}
          actionLabel="Add Alpha Task"
          onAction={handleCreate}
        />
      )}

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        clients={clients}
      />
    </div>
  );
}
