import { prisma } from "@/lib/prisma";
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Zap,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  Plus,
} from "lucide-react";
import DashboardCard from "./components/DashboardCard";
import DashboardVisuals from "./components/DashboardVisuals";
import PendingTasksWidget from "./components/features/dashboard/PendingTasksWidget";
import TodayPrioritiesWidget from "./components/features/dashboard/TodayPrioritiesWidget";
import LiveActivityFeed from "./components/features/dashboard/LiveActivityFeed";
import AICommandCenter from "./components/features/dashboard/AICommandCenter";
import PipelineView from "./components/features/dashboard/PipelineView";
import GrowthMetrics from "./components/features/dashboard/GrowthMetrics";
import Link from "next/link";

async function getDashboardData() {
  try {
    const [
      totalClients,
      totalLeads,
      leadsToday,
      pendingTasksCount,
      criticalTasks,
      revenueData,
      draftReportsCount,
      avgCsatData,
      hotLeads,
      atRiskCount,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.lead.count(),
      prisma.lead.count({
        where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
      prisma.task.count({ where: { status: { not: "Completed" } } }),
      prisma.task.findMany({
        where: {
          status: { not: "Completed" },
          OR: [{ priority: "Urgent" }, { priority: "High" }],
        },
        include: { client: true },
        take: 5,
        orderBy: { priority: "desc" },
      }),
      prisma.client.aggregate({ _sum: { revenue: true } }),
      prisma.report.count({ where: { status: "Draft" } }),
      prisma.report.aggregate({ where: { csatScore: { not: null } }, _avg: { csatScore: true } }),
      prisma.lead.findMany({
        where: { aiScore: { gte: 80 }, status: { notIn: ["Won", "Lost", "Converted"] } },
        take: 4,
        orderBy: { aiScore: "desc" },
      }),
      prisma.lead.count({ where: { status: "At_Risk" } }),
    ]);

    const leadsBySource = await prisma.lead.groupBy({
      by: ["source"],
      _count: { _all: true },
    });

    return {
      totalClients,
      totalLeads,
      leadsToday,
      pendingTasksCount,
      draftReportsCount,
      avgCsat: avgCsatData._avg.csatScore || 4.8,
      hotLeads,
      atRiskCount,
      criticalTasks: criticalTasks.map((t) => ({
        ...t,
        dueDate: t.dueDate ? t.dueDate.toISOString() : null,
      })),
      totalRevenue: revenueData._sum.revenue || 0,
      leadsBySource: leadsBySource.map((s) => ({ name: s.source, value: s._count._all })),
    };
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return {
      totalClients: 0,
      totalLeads: 0,
      leadsToday: 0,
      pendingTasksCount: 0,
      draftReportsCount: 0,
      avgCsat: 4.8,
      hotLeads: [],
      atRiskCount: 0,
      criticalTasks: [],
      totalRevenue: 0,
      leadsBySource: [],
    };
  }
}

export default async function Dashboard() {
  const stats = await getDashboardData();

  const chartData = [
    { name: "Mon", revenue: stats.totalRevenue * 0.2 },
    { name: "Tue", revenue: stats.totalRevenue * 0.3 },
    { name: "Wed", revenue: stats.totalRevenue * 0.25 },
    { name: "Thu", revenue: stats.totalRevenue * 0.4 },
    { name: "Fri", revenue: stats.totalRevenue * 0.5 },
    { name: "Sat", revenue: stats.totalRevenue * 0.8 },
    { name: "Sun", revenue: stats.totalRevenue },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "4rem" }}>

      {/* ── Top: Welcome + Quick Actions ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--foreground-subtle)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.375rem" }}>
            Monday, April 21 · Good Morning
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900, fontFamily: "var(--font-display)", letterSpacing: "-0.04em", lineHeight: 1.1, color: "var(--foreground)" }}>
            Reachly OS <span style={{ color: "var(--primary)" }}>Dashboard</span>
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--foreground-muted)", marginTop: "0.5rem", lineHeight: 1.5 }}>
            Your machine is running. {stats.totalLeads} leads · {stats.pendingTasksCount} pending tasks · AI active
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
          <Link href="/leads">
            <button className="btn btn-ghost" style={{ fontSize: "0.8125rem" }}>
              <Users size={14} />
              Add Lead
            </button>
          </Link>
          <Link href="/tasks">
            <button className="btn btn-ghost" style={{ fontSize: "0.8125rem" }}>
              <Zap size={14} />
              New Task
            </button>
          </Link>
          <Link href="/ai-hub">
            <button className="btn btn-primary" style={{ fontSize: "0.8125rem" }}>
              <MessageSquare size={14} />
              Start Campaign
            </button>
          </Link>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        <DashboardCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change="+12.5%"
          isPositive={true}
          icon={<DollarSign size={18} />}
          delay={0.05}
          accent="var(--accent-green)"
          subtitle="Portfolio value · all clients"
          progress={72}
        />
        <DashboardCard
          title="Active Leads"
          value={stats.totalLeads.toString()}
          change={`+${stats.leadsToday} today`}
          isPositive={true}
          icon={<Target size={18} />}
          delay={0.1}
          accent="var(--accent-blue)"
          subtitle="In pipeline right now"
          progress={60}
        />
        <DashboardCard
          title="Active Clients"
          value={stats.totalClients.toString()}
          change="+3 this month"
          isPositive={true}
          icon={<Users size={18} />}
          delay={0.15}
          accent="var(--primary)"
          subtitle="Retained + onboarding"
          progress={80}
        />
        <DashboardCard
          title="Meetings Today"
          value="6"
          change="+2 vs yesterday"
          isPositive={true}
          icon={<PhoneCall size={18} />}
          delay={0.2}
          accent="var(--accent-purple)"
          subtitle="Booked via AI sequences"
          progress={60}
        />
        <DashboardCard
          title="CSAT Score"
          value={`${stats.avgCsat.toFixed(1)}`}
          change="+5%"
          isPositive={true}
          icon={<TrendingUp size={18} />}
          delay={0.25}
          accent="var(--accent-green)"
          subtitle="Partner sentiment avg"
          progress={stats.avgCsat * 20}
        />
        <DashboardCard
          title="At-Risk Leads"
          value={stats.atRiskCount.toString()}
          change={stats.atRiskCount > 0 ? "Needs attention" : "All clear"}
          isPositive={stats.atRiskCount === 0}
          icon={<Zap size={18} />}
          delay={0.3}
          accent={stats.atRiskCount > 0 ? "var(--accent-red)" : "var(--accent-green)"}
          subtitle="Lifecycle alert"
          progress={stats.atRiskCount > 0 ? 100 : 0}
        />
      </div>

      {/* ── Growth Metrics ── */}
      <GrowthMetrics />

      {/* ── Charts Row ── */}
      <DashboardVisuals chartData={chartData} pieData={stats.leadsBySource} totalLeads={stats.totalLeads} />

      {/* ── Main Content: Pipeline + Activity + AI ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
        <PipelineView />
        <LiveActivityFeed />
        <AICommandCenter hotLeads={stats.hotLeads} />
      </div>

      {/* ── Bottom: Tasks Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
        <TodayPrioritiesWidget tasks={stats.criticalTasks} />
        <PendingTasksWidget count={stats.pendingTasksCount} />
      </div>
    </div>
  );
}
