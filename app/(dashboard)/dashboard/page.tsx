import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Target,
  TrendingUp,
  PhoneCall,
  Zap,
  MessageSquare,
  Clock,
  CheckSquare,
  ArrowRight,
  Flame,
  BarChart3,
  Users,
  Activity,
} from "lucide-react";
import DashboardCard from "@/app/components/DashboardCard";

async function getClientDashboardData() {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    const [
      totalLeads,
      leadsToday,
      leadsThisWeek,
      hotLeads,
      newLeads,
      contactedLeads,
      bookedLeads,
      wonLeads,
      lostLeads,
      pendingTasks,
      recentLeads,
      recentActivity,
      leadsBySource,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.lead.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.lead.findMany({
        where: { aiScore: { gte: 80 }, status: { notIn: ["Won", "Lost"] } },
        orderBy: { aiScore: "desc" },
        take: 5,
      }),
      prisma.lead.count({ where: { status: "New" } }),
      prisma.lead.count({ where: { status: "Contacted" } }),
      prisma.lead.count({ where: { status: "Booked" } }),
      prisma.lead.count({ where: { status: "Won" } }),
      prisma.lead.count({ where: { status: "Lost" } }),
      prisma.task.count({ where: { status: { not: "Completed" } } }),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.activity.findMany({
        orderBy: { date: "desc" },
        take: 8,
        include: { lead: true, client: true },
      }),
      prisma.lead.groupBy({
        by: ["source"],
        _count: { _all: true },
        orderBy: { source: "asc" },
        take: 5,
      }),
    ]);

    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

    return {
      totalLeads,
      leadsToday,
      leadsThisWeek,
      hotLeads,
      newLeads,
      contactedLeads,
      bookedLeads,
      wonLeads,
      lostLeads,
      pendingTasks,
      recentLeads,
      recentActivity: recentActivity.map((a) => ({
        ...a,
        date: a.date.toISOString(),
      })),
      leadsBySource,
      conversionRate,
    };
  } catch (error) {
    console.error("Client dashboard fetch error:", error);
    return {
      totalLeads: 0, leadsToday: 0, leadsThisWeek: 0,
      hotLeads: [], newLeads: 0, contactedLeads: 0,
      bookedLeads: 0, wonLeads: 0, lostLeads: 0,
      pendingTasks: 0, recentLeads: [], recentActivity: [],
      leadsBySource: [], conversionRate: 0,
    };
  }
}

const statusColor: Record<string, string> = {
  New: "var(--accent-blue)",
  Contacted: "var(--accent-orange)",
  Booked: "var(--primary)",
  Won: "var(--accent-green)",
  Lost: "var(--accent-red)",
  At_Risk: "var(--accent-red)",
};

const sourceBg: Record<string, string> = {
  WhatsApp: "rgba(37,211,102,0.12)",
  Website: "rgba(79,142,247,0.12)",
  Instagram: "rgba(200,65,220,0.12)",
  Facebook: "rgba(24,119,242,0.12)",
  Referral: "rgba(245,200,66,0.12)",
};

const sourceColor: Record<string, string> = {
  WhatsApp: "#25d366",
  Website: "var(--accent-blue)",
  Instagram: "#e1306c",
  Facebook: "#1877f2",
  Referral: "var(--primary)",
};

export default async function ClientDashboard() {
  const d = await getClientDashboardData();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "4rem" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.375rem" }}>
            {today}
          </div>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 900, fontFamily: "var(--font-display)", letterSpacing: "-0.04em", lineHeight: 1.1, color: "var(--foreground)" }}>
            Client <span style={{ color: "var(--accent-blue)" }}>Dashboard</span>
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--foreground-muted)", marginTop: "0.5rem" }}>
            {d.totalLeads} total leads · {d.leadsToday} new today · {d.pendingTasks} tasks pending
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
          <Link href="/leads">
            <button className="btn btn-ghost" style={{ fontSize: "0.8125rem" }}>
              <Target size={14} /> View Pipeline
            </button>
          </Link>
          <Link href="/ai-hub">
            <button className="btn btn-primary" style={{ fontSize: "0.8125rem" }}>
              <Zap size={14} /> Launch Campaign
            </button>
          </Link>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <DashboardCard
          title="Total Leads"
          value={d.totalLeads.toString()}
          change={`+${d.leadsToday} today`}
          isPositive={true}
          icon={<Target size={18} />}
          delay={0}
          accent="var(--accent-blue)"
          subtitle="In your CRM pipeline"
          progress={Math.min(d.totalLeads, 100)}
        />
        <DashboardCard
          title="This Week"
          value={d.leadsThisWeek.toString()}
          change={d.leadsThisWeek > 0 ? "Active growth" : "Need more leads"}
          isPositive={d.leadsThisWeek > 0}
          icon={<TrendingUp size={18} />}
          delay={0.05}
          accent="var(--accent-green)"
          subtitle="New leads in 7 days"
          progress={Math.min(d.leadsThisWeek * 10, 100)}
        />
        <DashboardCard
          title="Booked / Won"
          value={`${d.bookedLeads + d.wonLeads}`}
          change={`${d.conversionRate}% conversion`}
          isPositive={d.conversionRate > 0}
          icon={<PhoneCall size={18} />}
          delay={0.1}
          accent="var(--primary)"
          subtitle="Appointments confirmed"
          progress={d.conversionRate}
        />
        <DashboardCard
          title="Hot Leads"
          value={d.hotLeads.length.toString()}
          change={d.hotLeads.length > 0 ? "Ready to close" : "None right now"}
          isPositive={d.hotLeads.length > 0}
          icon={<Flame size={18} />}
          delay={0.15}
          accent="var(--accent-red)"
          subtitle="AI score ≥ 80"
          progress={Math.min(d.hotLeads.length * 20, 100)}
        />
        <DashboardCard
          title="Pending Tasks"
          value={d.pendingTasks.toString()}
          change={d.pendingTasks > 0 ? "Action needed" : "All clear!"}
          isPositive={d.pendingTasks === 0}
          icon={<CheckSquare size={18} />}
          delay={0.2}
          accent="var(--accent-purple)"
          subtitle="Follow-ups & reminders"
          progress={Math.min(d.pendingTasks * 10, 100)}
        />
      </div>

      {/* ── Pipeline Status Row ── */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "1.5rem" }}>
        <h2 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>
          Pipeline Breakdown
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "1rem" }}>
          {[
            { label: "New", count: d.newLeads, color: "var(--accent-blue)" },
            { label: "Contacted", count: d.contactedLeads, color: "var(--accent-orange)" },
            { label: "Booked", count: d.bookedLeads, color: "var(--primary)" },
            { label: "Won", count: d.wonLeads, color: "var(--accent-green)" },
            { label: "Lost", count: d.lostLeads, color: "var(--accent-red)" },
          ].map((stage) => (
            <div key={stage.label} style={{ textAlign: "center", padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: `1px solid ${stage.color}22` }}>
              <div style={{ fontSize: "2rem", fontWeight: 900, fontFamily: "var(--font-display)", color: stage.color, lineHeight: 1 }}>
                {stage.count}
              </div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--foreground-muted)", marginTop: "0.5rem" }}>
                {stage.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Two-Column ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>

        {/* Hot Leads */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Flame size={16} color="var(--accent-red)" /> Hot Leads
            </h2>
            <Link href="/leads" style={{ fontSize: "0.75rem", color: "var(--accent-blue)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {d.hotLeads.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--foreground-muted)", fontSize: "0.875rem" }}>
                No hot leads yet. Capture and qualify leads to see them here.
              </div>
            ) : (
              d.hotLeads.map((lead: any) => (
                <div key={lead.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", background: "rgba(255,255,255,0.02)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-red), #c53030)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "0.75rem", flexShrink: 0 }}>
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: "white", fontSize: "0.875rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lead.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>{lead.source} · {lead.status}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem", flexShrink: 0 }}>
                    <span style={{ background: "rgba(239,68,68,0.12)", color: "var(--accent-red)", padding: "2px 8px", borderRadius: "999px", fontSize: "0.65rem", fontWeight: 700 }}>
                      {lead.aiScore}% 🔥
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity + Sources */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Lead Sources */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <BarChart3 size={16} color="var(--accent-blue)" /> Lead Sources
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {d.leadsBySource.length === 0 ? (
                <div style={{ color: "var(--foreground-muted)", fontSize: "0.875rem" }}>No source data yet.</div>
              ) : (
                d.leadsBySource.map((s: any) => {
                  const pct = d.totalLeads > 0 ? Math.round((s._count._all / d.totalLeads) * 100) : 0;
                  return (
                    <div key={s.source} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{
                        padding: "2px 8px", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700,
                        background: sourceBg[s.source] || "rgba(255,255,255,0.06)",
                        color: sourceColor[s.source] || "var(--foreground-muted)",
                        minWidth: "80px", textAlign: "center",
                      }}>
                        {s.source}
                      </span>
                      <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "999px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: sourceColor[s.source] || "var(--accent-blue)", borderRadius: "999px", transition: "width 1s ease" }} />
                      </div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--foreground-muted)", minWidth: "40px", textAlign: "right" }}>
                        {s._count._all} ({pct}%)
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Leads */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "1.5rem", flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Clock size={16} color="var(--accent-orange)" /> Recent Leads
              </h2>
              <Link href="/leads" style={{ fontSize: "0.75rem", color: "var(--accent-blue)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                All <ArrowRight size={12} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {d.recentLeads.length === 0 ? (
                <div style={{ color: "var(--foreground-muted)", fontSize: "0.875rem" }}>No leads yet.</div>
              ) : (
                d.recentLeads.map((lead: any) => (
                  <div key={lead.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.625rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{lead.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--foreground-muted)" }}>{lead.phone || lead.email}</div>
                    </div>
                    <span style={{
                      padding: "2px 8px", borderRadius: "999px", fontSize: "0.65rem", fontWeight: 700, flexShrink: 0,
                      background: `${statusColor[lead.status] || "var(--accent-blue)"}18`,
                      color: statusColor[lead.status] || "var(--accent-blue)",
                    }}>
                      {lead.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions Footer ── */}
      <div style={{ background: "linear-gradient(135deg, rgba(79,142,247,0.06), rgba(79,142,247,0.02))", border: "1px solid rgba(79,142,247,0.15)", borderRadius: "20px", padding: "1.5rem" }}>
        <h2 style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--accent-blue)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>
          Quick Actions
        </h2>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {[
            { label: "Add Lead", href: "/leads", icon: <Target size={14} />, color: "var(--accent-blue)" },
            { label: "AI Hub", href: "/ai-hub", icon: <MessageSquare size={14} />, color: "var(--accent-purple)" },
            { label: "Tasks", href: "/tasks", icon: <CheckSquare size={14} />, color: "var(--accent-green)" },
            { label: "Reports", href: "/reports", icon: <BarChart3 size={14} />, color: "var(--primary)" },
            { label: "Activity", href: "/leads", icon: <Activity size={14} />, color: "var(--accent-orange)" },
          ].map((action) => (
            <Link key={action.href + action.label} href={action.href} style={{ textDecoration: "none" }}>
              <button style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.5rem 1rem", borderRadius: "10px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                color: "white", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s ease",
              }}>
                <span style={{ color: action.color }}>{action.icon}</span>
                {action.label}
              </button>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
