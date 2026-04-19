"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getClients() {
  try {
    return await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      take: 1000,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
}

import { logSystemActivity } from "@/lib/activityLogger";
import { generateOnboardingTasks } from "@/lib/taskGenerator";

export async function createClient(data: any) {
  try {
    const client = await prisma.client.create({
      data: {
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        status: data.status || "Active",
        revenue: parseFloat(data.revenue) || 0,
      },
    });
    
    await logSystemActivity({
      type: "CLIENT_ADDED",
      content: `Added new client: ${client.name} (${client.company})`,
      clientId: client.id,
      generateNotification: true,
      notificationLink: `/clients/${client.id}`
    });

    // AI Automation: Generate Onboarding Tasks
    await generateOnboardingTasks(client.id, client.name);

    revalidatePath("/clients");
    revalidatePath("/tasks");
    return { success: true, client };
  } catch (error) {
    console.error("Error creating client:", error);
    return { success: false, error: "Failed to create client" };
  }
}

export async function updateClient(id: string, data: any) {
  try {
    const client = await prisma.client.update({
      where: { id },
      data,
    });
    
    await logSystemActivity({
      type: "CLIENT_UPDATED",
      content: `Updated client details for ${client.name}`,
      clientId: client.id
    });

    revalidatePath("/clients");
    revalidatePath(`/clients/${id}`);
    return { success: true, client };
  } catch (error) {
    console.error("Error updating client:", error);
    return { success: false };
  }
}

export async function deleteClient(id: string) {
  try {
    const client = await prisma.client.findUnique({ where: { id } });
    await prisma.client.delete({ where: { id } });
    
    if (client) {
      await logSystemActivity({
        type: "CLIENT_DELETED",
        content: `Deleted client: ${client.name}`
      });
    }

    revalidatePath("/clients");
    return { success: true };
  } catch (error) {
    console.error("Error deleting client:", error);
    return { success: false };
  }
}
