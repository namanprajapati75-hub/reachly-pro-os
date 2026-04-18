"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  try {
    return await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function markNotificationRead(id: string) {
  try {
    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error(`Error marking notification read ${id}:`, error);
    return { success: false };
  }
}

export async function markAllNotificationsRead() {
  try {
    await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true }
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications read:", error);
    return { success: false };
  }
}

export async function clearNotifications() {
  try {
    await prisma.notification.deleteMany({
      where: { isRead: true }
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error clearing notifications:", error);
    return { success: false };
  }
}
