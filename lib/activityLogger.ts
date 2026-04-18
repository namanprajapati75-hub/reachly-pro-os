import { prisma } from "@/lib/prisma";

type LogOptions = {
  type: string;        // e.g. "LEAD_CAPTURED", "CLIENT_ADDED", "TASK_COMPLETED"
  content: string;     // e.g. "New lead captured from Web"
  clientId?: string;
  leadId?: string;
  generateNotification?: boolean;
  notificationLink?: string;
};

export async function logSystemActivity({ type, content, clientId, leadId, generateNotification, notificationLink }: LogOptions) {
  try {
    // 1. Log to Activity table
    await prisma.activity.create({
      data: {
        type,
        content,
        clientId,
        leadId
      }
    });

    // 2. Generate Notification if requested
    if (generateNotification) {
      let notifyType = "SYSTEM";
      if (type.includes("LEAD")) notifyType = "NEW_LEAD";
      if (type.includes("TASK")) notifyType = "TASK_DUE";
      if (type.includes("REPORT")) notifyType = "ALERT";

      let title = "System Notification";
      if (notifyType === "NEW_LEAD") title = "New Lead Captured";
      if (notifyType === "TASK_DUE") title = "Task Update";
      if (notifyType === "ALERT") title = "System Alert";

      // Hardcoded assignment to first admin User if exists, or global system stream (userId null)
      // We'll leave userId as null for global streams in single-tenant for now
      await prisma.notification.create({
        data: {
          title,
          message: content,
          type: notifyType,
          link: notificationLink
        }
      });
    }

    return true;
  } catch (error) {
    console.error("Failed to log activity:", error);
    return false;
  }
}
