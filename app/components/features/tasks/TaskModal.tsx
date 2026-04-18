"use client";

import { useState, useEffect } from "react";
import Modal from "@/app/components/ui/Modal";
import { useToast } from "@/app/components/ui/ToastProvider";
import { createTask, updateTask, deleteTask } from "@/app/actions/tasks";
import { Loader2, Trash2 } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: any;
  clients?: any[];
}

export default function TaskModal({ isOpen, onClose, task, clients = [] }: TaskModalProps) {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Open",
    dueDate: "",
    clientId: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Medium",
        status: task.status || "Open",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
        clientId: task.clientId || "",
      });
      setIsConfirmingDelete(false);
      setDeleteConfirmText("");
    } else {
      setFormData({ title: "", description: "", priority: "Medium", status: "Open", dueDate: "", clientId: "" });
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        clientId: formData.clientId === "" ? null : formData.clientId,
      };

      if (task?.id) {
        const res = await updateTask(task.id, dataToSubmit);
        if (res.success) {
          addToast("Task updated successfully!", "success");
          onClose();
        } else {
          addToast("Failed to update task.", "error");
        }
      } else {
        const res = await createTask(dataToSubmit);
        if (res.success) {
          addToast("Task created successfully!", "success");
          onClose();
        } else {
          addToast("Failed to create task.", "error");
        }
      }
    } catch (err) {
      addToast("An unexpected error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHardDelete = async () => {
    if (!task?.id || deleteConfirmText !== "DELETE") return;
    setIsSubmitting(true);
    try {
      const res = await deleteTask(task.id);
      if (res.success) {
        addToast("Task permanently deleted.", "success");
        onClose();
      } else {
        addToast("Failed to delete task.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? "Edit Task" : "New Task"}>
      {isConfirmingDelete ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h3 style={{ color: '#ef4444', fontWeight: 800, marginBottom: '0.5rem' }}>DANGER: Delete Task</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>This will permanently delete this operational task.</p>
          </div>
          <label style={{ fontSize: '0.875rem', fontWeight: 700 }}>
            Type DELETE to confirm:
            <input type="text" value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} placeholder="DELETE" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff' }} />
          </label>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => setIsConfirmingDelete(false)} className="glass btn-hover" style={{ flex: 1, padding: '0.75rem', borderRadius: '8px' }}>Cancel</button>
            <button onClick={handleHardDelete} disabled={deleteConfirmText !== "DELETE" || isSubmitting} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 700, opacity: deleteConfirmText !== "DELETE" ? 0.5 : 1 }}>
              {isSubmitting ? <Loader2 className="spinner" size={16} /> : "Delete"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
            Task Title
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }} />
          </label>
          
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
            Description
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', resize: 'none' }} />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Priority Level
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }}>
                <option value="Low" style={{ background: '#000' }}>Low</option>
                <option value="Medium" style={{ background: '#000' }}>Medium</option>
                <option value="High" style={{ background: '#000' }}>High</option>
                <option value="Urgent" style={{ background: '#000' }}>Urgent</option>
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Status
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }}>
                <option value="Open" style={{ background: '#000' }}>Open</option>
                <option value="In_Progress" style={{ background: '#000' }}>In Progress</option>
                <option value="Waiting_Client" style={{ background: '#000' }}>Waiting on Client</option>
                <option value="Completed" style={{ background: '#000' }}>Completed</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Due Date
              <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff', colorScheme: 'dark' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Related Client
              <select value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }}>
                <option value="" style={{ background: '#000' }}>Internal Task</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id} style={{ background: '#000' }}>{c.company || c.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <div>
              {task && (
                <button type="button" onClick={() => setIsConfirmingDelete(true)} className="glass btn-hover" style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: '#ef4444' }}>
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" onClick={onClose} className="glass btn-hover" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px' }}>Cancel</button>
              <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'var(--primary)', color: '#000', border: 'none', fontWeight: 800 }}>
                {isSubmitting ? <Loader2 className="spinner" size={18} /> : "Save Task"}
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
