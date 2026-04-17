"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Clock, CheckCircle2, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { getTasks } from "@/app/actions/tasks";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    const tasks = await getTasks();
    const now = new Date();
    
    const alerts: any[] = [];

    tasks.forEach((task: any) => {
      const dueDate = task.dueDate ? new Date(task.dueDate) : null;
      
      // 1. Overdue
      if (dueDate && dueDate < now && task.status !== 'Completed') {
        alerts.push({
          id: `overdue-${task.id}`,
          type: 'overdue',
          message: `OVERDUE: ${task.title}`,
          date: dueDate.toLocaleDateString(),
          color: '#ef4444'
        });
      }
      
      // 2. Due Today
      const isToday = dueDate && dueDate.toDateString() === now.toDateString();
      if (isToday && task.status !== 'Completed') {
        alerts.push({
          id: `today-${task.id}`,
          type: 'today',
          message: `DUE TODAY: ${task.title}`,
          date: 'Tonight',
          color: '#facc15'
        });
      }

      // 3. Urgent
      if (task.priority === 'Urgent' && task.status !== 'Completed') {
        alerts.push({
          id: `urgent-${task.id}`,
          type: 'urgent',
          message: `URGENT: ${task.title}`,
          date: 'Priority',
          color: 'var(--primary)'
        });
      }
    });

    setNotifications(alerts);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ 
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', 
              backdropFilter: 'blur(4px)', zIndex: 100 
            }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', top: 0, right: 0, height: '100%', width: '400px',
              background: 'var(--surface)', borderLeft: '1px solid var(--border)',
              zIndex: 101, padding: '2rem', display: 'flex', flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Intelligence Center</h2>
              <button onClick={onClose} className="glass" style={{ padding: '0.5rem', borderRadius: '10px' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {notifications.length > 0 ? notifications.map((notif) => (
                <div key={notif.id} className="glass" style={{ 
                  padding: '1.25rem', borderRadius: '16px', borderLeft: `4px solid ${notif.color}`,
                  background: 'rgba(255,255,255,0.02)'
                }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '0.25rem' }}>
                      {notif.type === 'overdue' && <AlertCircle size={18} color={notif.color} />}
                      {notif.type === 'today' && <Clock size={18} color={notif.color} />}
                      {notif.type === 'urgent' && <Zap size={18} color={notif.color} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '0.25rem' }}>{notif.message}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notif.date}</div>
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                  <div className="glass" style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <CheckCircle2 size={24} color="var(--primary)" />
                  </div>
                  <h3 style={{ fontWeight: 600 }}>All Clear</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>No urgent alerts found in your pipeline.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
