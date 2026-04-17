import { prisma } from "@/lib/prisma";
import { 
  TrendingUp, 
  Users, 
  Target, 
  Clock, 
  Sparkles,
  Filter
} from "lucide-react";
import DashboardCard from "./components/DashboardCard";
import DashboardVisuals from "./components/DashboardVisuals";
import PendingTasksWidget from "./components/features/dashboard/PendingTasksWidget";
import TodayPrioritiesWidget from "./components/features/dashboard/TodayPrioritiesWidget";

async function getDashboardData() {
  try {
    const [totalClients, totalLeads, leadsToday, pendingTasksCount, criticalTasks, revenueData] = await Promise.all([
      prisma.client.count(),
      prisma.lead.count(),
      prisma.lead.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.task.count({
        where: { status: { not: "Completed" } },
      }),
      prisma.task.findMany({
        where: { 
          status: { not: "Completed" },
          OR: [
            { priority: "Urgent" },
            { priority: "High" }
          ]
        },
        include: { client: true },
        take: 3,
        orderBy: { priority: "desc" }
      }),
      prisma.client.aggregate({
        _sum: { revenue: true },
      }),
    ]);

    // Aggregate leads by source
    const leadsBySource = await prisma.lead.groupBy({
      by: ['source'],
      _count: { _all: true },
    });

    return {
      totalClients,
      totalLeads,
      leadsToday,
      pendingTasksCount,
      criticalTasks: criticalTasks.map(t => ({ 
        ...t, 
        dueDate: t.dueDate ? t.dueDate.toISOString() : null 
      })),
      totalRevenue: revenueData._sum.revenue || 0,
      leadsBySource: leadsBySource.map(s => ({ name: s.source, value: s._count._all })),
    };
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return {
      totalClients: 0,
      totalLeads: 0,
      leadsToday: 0,
      pendingTasksCount: 0,
      criticalTasks: [],
      totalRevenue: 0,
      leadsBySource: [],
    };
  }
}

export default async function Dashboard() {
  const stats = await getDashboardData();

  const chartData = [
    { name: 'Mon', revenue: stats.totalRevenue * 0.2 },
    { name: 'Tue', revenue: stats.totalRevenue * 0.3 },
    { name: 'Wed', revenue: stats.totalRevenue * 0.25 },
    { name: 'Thu', revenue: stats.totalRevenue * 0.4 },
    { name: 'Fri', revenue: stats.totalRevenue * 0.5 },
    { name: 'Sat', revenue: stats.totalRevenue * 0.8 },
    { name: 'Sun', revenue: stats.totalRevenue },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      <header>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>Welcome back, Administrator</h2>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>Reachly Pro Overview</h1>
      </header>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <DashboardCard 
          title="Total Portfolio" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          change="+12.5%" 
          isPositive={true} 
          icon={<TrendingUp size={20} />} 
          delay={0.1}
        />
        <DashboardCard 
          title="Pipeline Strength" 
          value={stats.totalLeads.toString()} 
          change={`${stats.leadsToday} today`} 
          isPositive={true} 
          icon={<Target size={20} />} 
          delay={0.2}
        />
        <DashboardCard 
          title="Active Clients" 
          value={stats.totalClients.toString()} 
          change="Real-time" 
          isPositive={true} 
          icon={<Users size={20} />} 
          delay={0.3}
        />
        <PendingTasksWidget count={stats.pendingTasksCount} />
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <DashboardVisuals chartData={chartData} pieData={stats.leadsBySource} totalLeads={stats.totalLeads} />
        </div>
        <div style={{ flex: 1, minWidth: '350px' }}>
          <TodayPrioritiesWidget tasks={stats.criticalTasks} />
        </div>
      </div>
    </div>
  );
}
