"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  try {
    const settings = await prisma.setting.findMany();
    // Default struct
    const config: any = {
      fullName: "Reachly Administrator",
      email: "admin@reachly.pro",
      bio: "Elite digital marketing agency focused on AI-driven growth systems.",
      theme: "dark",
      twoFactor: "false"
    };
    for (const s of settings) {
      config[s.key] = s.value;
    }
    return config;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}

import { logSystemActivity } from "@/lib/activityLogger";

export async function updateSettings(data: any) {
  try {
    const keys = Object.keys(data);
    for (const key of keys) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(data[key]) },
        create: { key, value: String(data[key]) }
      });
    }
    
    await logSystemActivity({
      type: "SYSTEM_SETTINGS_UPDATED",
      content: `Workspace settings modified`,
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
