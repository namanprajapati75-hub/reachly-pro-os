"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Clock, CheckCircle2, Zap, Bell, ListTodo, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { getNotifications, markAllNotificationsRead, clearNotifications } from "@/app/actions/notifications";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onReadAction: () => void;
}

export default function NotificationDrawer({ isOpen, onClose, onReadAction }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    await loadNotifications();
    onReadAction();
  };

  const handleClear = async () => {
    await clearNotifications();
    await loadNotifications();
    onReadAction();
  };

  const getIcon = (type: string, color: string) => {
    switch (type) {
      case 'NEW_LEAD': return <UserPlus size={18} color={color} />;
      case 'TASK_DUE': return <Clock size={18} color={color} />;
      case 'ALERT': return <AlertCircle size={18} color={color} />;
      default: return <Bell size={18} color={color} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'NEW_LEAD': return '#22c55e';
      case 'TASK_DUE': return '#facc15';
      case 'ALERT': return '#ef4444';
      default: return 'var(--primary)';
    }
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
              <button onClick={onClose} className="glass btn-hover" style={{ padding: '0.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {notifications.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button onClick={handleMarkAllRead} className="glass btn-hover" style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  Mark All Read
                </button>
                <button onClick={handleClear} className="glass btn-hover" style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  Clear Read
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {notifications.length > 0 ? notifications.map((notif) => {
                const color = getColor(notif.type);
                const isUnread = !notif.isRead;
                return (
                  <div key={notif.id} className="glass" style={{ 
                    padding: '1.25rem', borderRadius: '16px', borderLeft: `4px solid ${color}`,
                    background: isUnread ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.01)',
                    cursor: notif.link ? 'pointer' : 'default',
                    opacity: isUnread ? 1 : 0.6
                  }} onClick={() => {
                    if (notif.link) {
                      router.push(notif.link);
                      onClose();
                    }
                  }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <div style={{ marginTop: '0.25rem' }}>
                        {getIcon(notif.type, color)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.925rem', fontWeight: isUnread ? 800 : 600, marginBottom: '0.25rem', color: isUnread ? '#fff' : 'var(--text-muted)' }}>
                          {notif.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{notif.message}</div>
                        <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 700 }}>
                          {new Date(notif.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }) : (
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
