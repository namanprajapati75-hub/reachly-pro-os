"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type SidebarState = "full" | "rail" | "hidden";

interface SidebarContextType {
  state: SidebarState;
  setState: (state: SidebarState) => void;
  isMobileOpen: boolean;
  toggleMobile: () => void;
  toggleRail: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [state, setSidebarState] = useState<SidebarState>("full");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("reachly_sidebar_state") as SidebarState;
    if (saved) setSidebarState(saved);
    
    // Auto-rail on tablet
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setSidebarState("rail");
      } else if (window.innerWidth < 768) {
        setSidebarState("hidden");
      } else {
        // Restore saved or default
        const currentSaved = localStorage.getItem("reachly_sidebar_state") as SidebarState;
        setSidebarState(currentSaved || "full");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const setState = (newState: SidebarState) => {
    setSidebarState(newState);
    if (newState !== "hidden") {
      localStorage.setItem("reachly_sidebar_state", newState);
    }
  };

  const toggleRail = () => {
    const next = state === "full" ? "rail" : "full";
    setState(next);
  };

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <SidebarContext.Provider value={{ state, setState, isMobileOpen, toggleMobile, toggleRail }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within SidebarProvider");
  return context;
};
