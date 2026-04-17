"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  CheckSquare, 
  BarChart3, 
  Sparkles,
  Settings,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Leads", href: "/crm/leads" },
  { icon: UserSquare2, label: "Clients", href: "/crm/clients" },
  { icon: CheckSquare, label: "Tasks", href: "/tasks" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Sparkles, label: "AI Hub", href: "/ai-hub" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar glass" style={{
      width: '280px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1rem',
      zIndex: 100,
      borderRight: '1px solid var(--border)'
    }}>
      <div className="logo-container" style={{ marginBottom: '3rem', padding: '0 1rem' }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 800, 
          letterSpacing: '-1px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          REACHLY <span style={{ color: 'var(--primary)', fontWeight: 400 }}>OS</span>
        </h1>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link href={item.href} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.875rem 1rem',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  background: isActive ? 'var(--primary-glow)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                  position: 'relative',
                  overflow: 'hidden'
                }} className="menu-link">
                  <item.icon size={20} />
                  <span style={{ fontWeight: isActive ? 600 : 400, fontSize: '0.925rem' }}>{item.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav"
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <ChevronRight size={14} />
                    </motion.div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer" style={{ marginTop: 'auto', padding: '1rem' }}>
        <Link href="/settings" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          color: 'var(--text-muted)',
          fontSize: '0.925rem'
        }}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </div>

      <style jsx>{`
        .menu-link:hover {
          color: var(--foreground) !important;
          background: var(--surface-hover) !important;
        }
      `}</style>
    </aside>
  );
}
