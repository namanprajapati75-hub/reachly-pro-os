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
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "framer-motion";

// Helper for Recharts server-side? No, Recharts must stay in Client Components.
// I'll keep the charts in a separate client component file or just use the current one.
// Actually, I'll refactor the fetching to the server and pass data to a Client Dashboard.

async function getDashboardData() {
  try {
    const [totalClients, totalLeads, leadsToday, activeTasks, revenueData] = await Promise.all([
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
        where: { status: { not: "Done" } },
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
      activeTasks,
      totalRevenue: revenueData._sum.revenue || 0,
      leadsBySource: leadsBySource.map(s => ({ name: s.source, value: s._count._all })),
    };
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return {
      totalClients: 0,
      totalLeads: 0,
      leadsToday: 0,
      activeTasks: 0,
      totalRevenue: 0,
      leadsBySource: [],
    };
  }
}

export default async function Dashboard() {
  const stats = await getDashboardData();

  // Mock growth data for the area chart (since we don't have historical revenue trends yet)
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
        <DashboardCard 
          title="Pending Ops" 
          value={stats.activeTasks.toString()} 
          change="Tasks" 
          isPositive={false} 
          icon={<Clock size={20} />} 
          delay={0.4}
        />
      </div>

      {/* Since I need framer-motion and recharts, I'll use a Client Component for the visuals */}
      <DashboardVisuals chartData={chartData} pieData={stats.leadsBySource} totalLeads={stats.totalLeads} />
    </div>
  );
}

// I'll create a separate file for the Client component but for now I'll just import it.
import DashboardVisuals from "./components/DashboardVisuals";
