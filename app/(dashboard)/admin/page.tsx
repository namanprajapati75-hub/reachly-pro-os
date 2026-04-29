import { prisma } from "@/lib/prisma";
import {
  Building2,
  Users,
  Target,
  DollarSign,
  Zap,
  Activity,
  AlertCircle,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Bot
} from "lucide-react";
import Link from "next/link";

async function getAdminData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  try {
    const [
      allClients,
      totalLeads,
      openTasksCount,
      leadsByClient
    ] = await Promise.all([
      prisma.client.findMany({
        orderBy: { revenue: 'desc' }
      }),
      prisma.lead.count(),
      prisma.task.count({ where: { status: { not: "Completed" } } }),
      prisma.lead.groupBy({
        by: ["assignedClientId"],
        _count: { _all: true },
      })
    ]);

    const activeClients = allClients.filter(c => c.status === "Active");
    const churnedClients = allClients.filter(c => c.status !== "Active");
    const newSignups = allClients.filter(c => c.createdAt >= startOfMonth);
    
    const mrr = activeClients.reduce((sum, c) => sum + (c.revenue || 0), 0);

    // Map leads to clients for top/low performers
    const clientPerformance = activeClients.map(c => {
      const leadsCount = leadsByClient.find(l => l.assignedClientId === c.id)?._count._all || 0;
      return { ...c, leadsCount };
    });

    const sortedByPerformance = [...clientPerformance].sort((a, b) => b.leadsCount - a.leadsCount);
    const topClients = sortedByPerformance.slice(0, 3);
    const lowClients = sortedByPerformance.slice(-3).reverse();

    const botStatus = "Online";

    return {
      activeClientsCount: activeClients.length,
      mrr,
      newSignupsCount: newSignups.length,
      churnedCount: churnedClients.length,
      totalLeads,
      openTasksCount,
      automationErrors: 0,
      botStatus,
      allClients,
      topClients,
      lowClients
    };
  } catch (error) {
    console.error("Failed to fetch admin data:", error);
    return {
      activeClientsCount: 0, mrr: 0, newSignupsCount: 0, churnedCount: 0,
      totalLeads: 0, openTasksCount: 0, automationErrors: 0, botStatus: "Offline",
      allClients: [], topClients: [], lowClients: []
    };
  }
}

export default async function AdminDashboard() {
  const data = await getAdminData();

  return (
    <div style={{ paddingBottom: "4rem" }}>
      {/* ── Top: Welcome & Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-red)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-red)", boxShadow: "0 0 10px var(--accent-red)" }}></div>
            Internal Use Only
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, fontFamily: "var(--font-display)", letterSpacing: "-0.04em", lineHeight: 1.1, color: "var(--foreground)" }}>
            Reachly <span style={{ color: "var(--primary)" }}>Admin</span>
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--foreground-muted)", marginTop: "0.5rem" }}>
            Global Operations Control Center.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn btn-primary" style={{ fontSize: "0.875rem", padding: "0.5rem 1rem", border: "none" }}>
            + New Client
          </button>
          <button className="btn btn-ghost" style={{ fontSize: "0.875rem", padding: "0.5rem 1rem", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "white", borderRadius: "12px" }}>
            Send Invoice
          </button>
        </div>
      </div>

      {/* ── Business Overview Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
        {/* MRR */}
        <div style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", color: "var(--foreground-muted)" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Total MRR</span>
            <div style={{ padding: "0.5rem", background: "rgba(var(--primary-rgb), 0.1)", borderRadius: "10px" }}>
              <DollarSign size={16} color="var(--primary)" />
            </div>
          </div>
          <div style={{ fontSize: "2.25rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "white" }}>
            ${data.mrr.toLocaleString()}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--accent-green)" }}>
            <ArrowUpRight size={14} /> Tracking positive
          </div>
        </div>

        {/* Active Clients */}
        <div style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", color: "var(--foreground-muted)" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Active Clients</span>
            <div style={{ padding: "0.5rem", background: "rgba(var(--accent-blue-rgb, 59, 130, 246), 0.1)", borderRadius: "10px" }}>
              <Users size={16} color="var(--accent-blue, #3b82f6)" />
            </div>
          </div>
          <div style={{ fontSize: "2.25rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "white" }}>
            {data.activeClientsCount}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--accent-green)" }}>
            <ArrowUpRight size={14} /> +{data.newSignupsCount} this month
          </div>
        </div>

        {/* Churn */}
        <div style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", color: "var(--foreground-muted)" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Churned</span>
            <div style={{ padding: "0.5rem", background: "rgba(239, 68, 68, 0.1)", borderRadius: "10px" }}>
              <AlertCircle size={16} color="var(--accent-red)" />
            </div>
          </div>
          <div style={{ fontSize: "2.25rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "white" }}>
            {data.churnedCount}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--foreground-muted)" }}>
            Accounts cancelled
          </div>
        </div>

        {/* Total Leads */}
        <div style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", color: "var(--foreground-muted)" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Total Leads Gen</span>
            <div style={{ padding: "0.5rem", background: "rgba(168, 85, 247, 0.1)", borderRadius: "10px" }}>
              <Target size={16} color="var(--accent-purple, #a855f7)" />
            </div>
          </div>
          <div style={{ fontSize: "2.25rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "white" }}>
            {data.totalLeads.toLocaleString()}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--accent-green)" }}>
            Across all active clients
          </div>
        </div>
      </div>

      {/* ── Two Column Layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
        
        {/* Left Col: Client Management */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Briefcase size={18} color="var(--primary)" /> Client Management
            </h2>
            <Link href="/clients" style={{ fontSize: "0.8rem", color: "var(--primary)", textDecoration: "none" }}>View All</Link>
          </div>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--foreground-muted)" }}>
                  <th style={{ paddingBottom: "1rem", fontWeight: 600 }}>Client</th>
                  <th style={{ paddingBottom: "1rem", fontWeight: 600 }}>Plan / MRR</th>
                  <th style={{ paddingBottom: "1rem", fontWeight: 600 }}>Status</th>
                  <th style={{ paddingBottom: "1rem", fontWeight: 600, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.allClients.slice(0, 8).map(client => (
                  <tr key={client.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "1rem 0" }}>
                      <div style={{ fontWeight: 600, color: "white" }}>{client.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>{client.company}</div>
                    </td>
                    <td style={{ padding: "1rem 0", color: "var(--foreground)" }}>
                      ${client.revenue.toLocaleString()}/mo
                    </td>
                    <td style={{ padding: "1rem 0" }}>
                      <span style={{ 
                        padding: "0.25rem 0.6rem", 
                        borderRadius: "999px", 
                        fontSize: "0.7rem", 
                        fontWeight: 600, 
                        background: client.status === "Active" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        color: client.status === "Active" ? "var(--accent-green)" : "var(--accent-red)"
                      }}>
                        {client.status}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 0", textAlign: "right" }}>
                      <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "0.3rem 0.7rem", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer", marginRight: "0.5rem" }}>
                        Upgrade
                      </button>
                      <button style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "0.3rem 0.7rem", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}>
                        Portal
                      </button>
                    </td>
                  </tr>
                ))}
                {data.allClients.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "var(--foreground-muted)" }}>
                      No clients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Operations & Performance */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Operations */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Activity size={18} color="var(--accent-blue, #3b82f6)" /> System Operations
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.03)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--foreground-muted)" }}>
                  <Bot size={16} /> AI Bot Status
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", color: "var(--accent-green)", fontWeight: 600 }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-green)", boxShadow: "0 0 8px var(--accent-green)" }}></div> Online
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.03)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--foreground-muted)" }}>
                  <AlertCircle size={16} /> Automation Errors
                </div>
                <div style={{ fontSize: "0.875rem", color: "white", fontWeight: 600 }}>
                  {data.automationErrors}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.03)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--foreground-muted)" }}>
                  <Zap size={16} /> Open Tasks
                </div>
                <div style={{ fontSize: "0.875rem", color: "white", fontWeight: 600 }}>
                  {data.openTasksCount}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Watchlist */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "1.5rem", flex: 1 }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <Target size={18} color="var(--accent-purple, #a855f7)" /> Client Performance
            </h2>
            
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", fontWeight: 600 }}>Top Performing (Leads)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {data.topClients.map(c => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", padding: "0.5rem", background: "rgba(255,255,255,0.02)", borderRadius: "6px" }}>
                    <span style={{ color: "white", fontWeight: 500 }}>{c.name}</span>
                    <span style={{ color: "var(--accent-green)", fontWeight: 600 }}>{c.leadsCount} leads</span>
                  </div>
                ))}
                {data.topClients.length === 0 && <span style={{fontSize:"0.8rem", color:"var(--foreground-muted)"}}>No data yet</span>}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem", fontWeight: 600 }}>Low Performing</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {data.lowClients.map(c => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", padding: "0.5rem", background: "rgba(255,255,255,0.02)", borderRadius: "6px" }}>
                    <span style={{ color: "white", fontWeight: 500 }}>{c.name}</span>
                    <span style={{ color: "var(--accent-red)", fontWeight: 600 }}>{c.leadsCount} leads</span>
                  </div>
                ))}
                {data.lowClients.length === 0 && <span style={{fontSize:"0.8rem", color:"var(--foreground-muted)"}}>No data yet</span>}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
