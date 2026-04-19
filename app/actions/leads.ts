"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getLeads() {
  try {
    return await prisma.lead.findMany({
      include: { client: true },
      orderBy: { createdAt: "desc" },
      take: 1500, // Limit payload to prevent edge timeouts on high volume
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
}

import { logSystemActivity } from "@/lib/activityLogger";
import { generateWonLeadTasks } from "@/lib/taskGenerator";

export async function createLead(data: any) {
  try {
    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        source: data.source || "Website",
        status: data.status || "New",
        notes: data.notes,
        assignedClientId: data.assignedClientId,
      },
    });

    await logSystemActivity({
      type: "LEAD_CAPTURED",
      content: `New lead captured [${lead.source}]: ${lead.name}`,
      leadId: lead.id,
      clientId: lead.assignedClientId || undefined,
      generateNotification: true,
      notificationLink: `/leads`
    });

    revalidatePath("/leads");
    return { success: true, lead };
  } catch (error) {
    console.error("Error creating lead:", error);
    return { success: false, error: "Failed to create lead" };
  }
}

export async function updateLead(id: string, data: any) {
  try {
    const oldLead = await prisma.lead.findUnique({ where: { id } });

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        source: data.source,
        status: data.status,
        notes: data.notes,
        assignedClientId: data.assignedClientId,
      },
    });

    await logSystemActivity({
      type: "LEAD_UPDATED",
      content: `Lead status updated to ${lead.status}: ${lead.name}`,
      leadId: lead.id,
      clientId: lead.assignedClientId || undefined
    });

    // AI Automation: Generate Tasks if status changed to Won
    if (data.status === 'Won' && oldLead?.status !== 'Won') {
      await generateWonLeadTasks(lead.id, lead.name, lead.company);
    }

    revalidatePath("/leads");
    revalidatePath("/tasks");
    return { success: true, lead };
  } catch (error) {
    console.error("Error updating lead:", error);
    return { success: false, error: "Failed to update lead" };
  }
}

export async function deleteLead(id: string) {
  try {
    const lead = await prisma.lead.findUnique({ where: { id } });
    await prisma.lead.delete({
      where: { id },
    });

    if (lead) {
      await logSystemActivity({
        type: "LEAD_DELETED",
        content: `Deleted lead: ${lead.name}`,
        clientId: lead.assignedClientId || undefined
      });
    }

    revalidatePath("/leads");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead:", error);
    return { success: false, error: "Failed to delete lead" };
  }
}
