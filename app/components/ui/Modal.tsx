"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
}

export default function Modal({ isOpen, onClose, title, children, width = "500px" }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; }
  }, [isOpen]);

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
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 999,
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass"
            style={{
              position: "fixed",
              top: "50%", left: "50%",
              x: "-50%", y: "-50%", // framer-motion positioning
              width: "90%",
              maxWidth: width,
              maxHeight: "90vh",
              overflowY: "auto",
              zIndex: 1000,
              borderRadius: "24px",
              padding: "2rem",
              border: "1px solid var(--border)",
              background: "rgba(20,20,20,0.8)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "var(--font-outfit)" }}>{title}</h2>
              <button 
                onClick={onClose}
                className="glass btn-hover"
                style={{ padding: "0.5rem", borderRadius: "50%", border: "none", cursor: "pointer", display: "flex" }}
              >
                <X size={20} color="var(--text-muted)" />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
