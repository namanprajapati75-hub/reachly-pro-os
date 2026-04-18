"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getReports() {
  try {
    return await prisma.report.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" },
      take: 500,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

export async function getReportById(id: string) {
  try {
    return await prisma.report.findUnique({
      where: { id },
      include: { client: true },
    });
  } catch (error) {
    console.error(`Error fetching report ${id}:`, error);
    return null;
  }
}

export async function generateClientReport(clientId: string) {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [client, leads, tasks, activities] = await Promise.all([
      prisma.client.findUnique({ where: { id: clientId } }),
      prisma.lead.findMany({ where: { assignedClientId: clientId } }), // In this simple OS, we track leads per client
      prisma.task.findMany({ where: { clientId } }),
      prisma.activity.findMany({ where: { clientId } }),
    ]);

    if (!client) throw new Error("Client not found");

    const totalLeads = leads.length;
    const convertedLeads = leads.filter(l => l.status === 'Converted').length;
    const convRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    const sourceBreakdown = leads.reduce((acc: any, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {});

    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const engagementScore = activities.length;

    const metricsSnapshot = {
      totalLeads,
      convertedLeads,
      conversionRate: convRate.toFixed(1),
      sourceBreakdown,
      completedTasks,
      totalTasks: tasks.length,
      engagement: engagementScore,
      revenue: client.revenue,
    };

    const report = await prisma.report.create({
      data: {
        title: `Performance Report - ${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`,
        status: "Draft",
        metrics: metricsSnapshot,
        clientId,
        wins: "Secured high-quality leads from primary channels. Operational velocity increased by 15% this month.",
        recommendations: "Double down on Website content strategy. Increase Facebook ad spend for the upcoming holiday season.",
      },
    });

    revalidatePath("/reports");
    return { success: true, report };
  } catch (error) {
    console.error("Error generating report:", error);
    return { success: false, error: "Failed to generate report" };
  }
}

export async function updateReportStatus(id: string, status: string, csatScore?: number) {
  try {
    const data: any = { status };
    if (csatScore !== undefined) data.csatScore = csatScore;
    
    await prisma.report.update({
      where: { id },
      data,
    });
    revalidatePath("/reports");
    revalidatePath(`/reports/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating report status:", error);
    return { success: false, error: "Failed to update report status" };
  }
}

export async function deleteReport(id: string) {
  try {
     await prisma.report.delete({ where: { id } });
     revalidatePath("/reports");
     return { success: true };
  } catch (error) {
    console.error("Error deleting report:", error);
    return { success: false };
  }
}
