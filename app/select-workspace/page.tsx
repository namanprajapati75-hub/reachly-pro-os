"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Users, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SelectWorkspacePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [lastWorkspace, setLastWorkspace] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("reachly_last_workspace");
    if (saved) setLastWorkspace(saved);
  }, []);

  const handleSelect = (workspace: string, path: string) => {
    localStorage.setItem("reachly_last_workspace", workspace);
    router.push(path);
  };

  if (!mounted) return null;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      width: "100%",
      padding: "2rem",
      position: "relative",
      overflow: "hidden"
    }}>
      
      {/* Background Glows */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, var(--primary-dim) 0%, transparent 70%)",
        opacity: 0.5,
        pointerEvents: "none",
        zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ zIndex: 1, textAlign: "center", marginBottom: "3rem" }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "var(--surface-2)", borderRadius: "var(--radius-full)", border: "1px solid var(--border)", marginBottom: "1.5rem" }}>
          <Lock size={14} className="text-green" />
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--foreground-subtle)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Secure Session Active
          </span>
        </div>
        <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, fontFamily: "var(--font-display)", letterSpacing: "-0.04em", lineHeight: 1.1, color: "var(--foreground)", marginBottom: "1rem" }}>
          Welcome to <span className="text-glow">Reachly OS</span>
        </h1>
        <p style={{ fontSize: "1.125rem", color: "var(--foreground-muted)", maxWidth: "400px", margin: "0 auto" }}>
          Choose your workspace to continue.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", width: "100%", maxWidth: "800px", zIndex: 1 }}>
        
        {/* Admin Dashboard Option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div 
            onClick={() => handleSelect("admin", "/admin")}
            className="premium-card hover-lift"
            style={{ 
              padding: "2rem", 
              cursor: "pointer",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              border: lastWorkspace === "admin" ? "1px solid var(--primary)" : "1px solid var(--border)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-md)", background: "var(--primary-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                <ShieldAlert size={24} />
              </div>
              {lastWorkspace === "admin" && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Last Used
                </div>
              )}
            </div>
            
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: "0.75rem" }}>Admin Dashboard</h2>
            <p style={{ color: "var(--foreground-muted)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "2rem", flex: 1 }}>
              Internal management panel. Monitor total leads, revenue tracking, system health, and overall agency analytics.
            </p>
            
            <div style={{ display: "flex", alignItems: "center", color: "var(--primary)", fontWeight: 600, fontSize: "0.875rem", marginTop: "auto", gap: "0.5rem" }}>
              Enter Workspace <ArrowRight size={16} />
            </div>
          </div>
        </motion.div>

        {/* Client Dashboard Option */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div 
            onClick={() => handleSelect("clients", "/clients")}
            className="premium-card hover-lift"
            style={{ 
              padding: "2rem", 
              cursor: "pointer",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              border: lastWorkspace === "clients" ? "1px solid var(--accent-blue)" : "1px solid var(--border)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-md)", background: "var(--accent-blue-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-blue)" }}>
                <Users size={24} />
              </div>
              {lastWorkspace === "clients" && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--accent-blue)", fontSize: "0.75rem", fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Last Used
                </div>
              )}
            </div>
            
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: "0.75rem" }}>All Client Dashboard</h2>
            <p style={{ color: "var(--foreground-muted)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "2rem", flex: 1 }}>
              Client-facing area. Access specific client dashboards, monitor CRM activity, and generate performance reports.
            </p>
            
            <div style={{ display: "flex", alignItems: "center", color: "var(--accent-blue)", fontWeight: 600, fontSize: "0.875rem", marginTop: "auto", gap: "0.5rem" }}>
              Enter Workspace <ArrowRight size={16} />
            </div>
          </div>
        </motion.div>

      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        style={{ position: "absolute", bottom: "2rem", color: "var(--foreground-subtle)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        <span className="live-dot" style={{ width: "4px", height: "4px" }}></span>
        System Online · Encrypted Connection
      </motion.div>
    </div>
  );
}
