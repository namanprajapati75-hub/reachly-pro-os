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
    revalidatePath("/clients");
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
    await prisma.client.delete({ where: { id } });
    revalidatePath("/clients");
    return { success: true };
  } catch (error) {
    console.error("Error deleting client:", error);
    return { success: false };
  }
}
