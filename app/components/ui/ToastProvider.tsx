"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="glass"
              style={{
                padding: "1rem 1.5rem",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                minWidth: "300px",
                border: `1px solid ${toast.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : toast.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'var(--border)'}`,
                background: toast.type === 'success' ? 'rgba(34, 197, 94, 0.05)' : toast.type === 'error' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(255,255,255,0.02)',
              }}
            >
              {toast.type === "success" && <CheckCircle2 size={24} color="#22c55e" />}
              {toast.type === "error" && <AlertCircle size={24} color="#ef4444" />}
              {toast.type === "info" && <Info size={24} color="var(--primary)" />}
              
              <span style={{ fontWeight: 600, flex: 1 }}>{toast.message}</span>
              
              <button 
                onClick={() => removeToast(toast.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
