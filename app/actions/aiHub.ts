"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAIInboxLeads() {
  try {
    await recalculateLeadLifecycle();
  } catch (e) {
    console.warn("Non-fatal: Lead lifecycle recalculation skipped due to error:", e);
  }
  
  try {
    const leads = await prisma.lead.findMany({
      include: { activities: true },
      orderBy: { aiScore: "desc" },
      take: 1500, // Optimized for 1000+ targeted
    });

    const active = leads.filter(l => !['At_Risk', 'Cold', 'Lost', 'Won'].includes(l.status));
    const reactivation = leads.filter(l => ['At_Risk', 'Cold'].includes(l.status));
    const all = leads;

    return { active, reactivation, all };
  } catch (error) {
    console.error("Error fetching AI Inbox leads:", error);
    return { active: [], reactivation: [], all: [] };
  }
}

async function recalculateLeadLifecycle() {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const leads = await prisma.lead.findMany({
      select: {
        id: true,
        status: true,
        aiScore: true,
        temperature: true,
        lastContactedAt: true,
        source: true
      },
      where: {
        status: { notIn: ['Converted', 'Won', 'Lost'] }
      },
      take: 5000 // Limit scope to avoid Vercel timeouts for huge databases
    });

    const updates = [];

    for (const lead of leads) {
      let newStatus = lead.status;
      let newScore = lead.aiScore;
      let newTemp = lead.temperature;

      // 1. Status Lifecycle Logic safely checking dates
      if (lead.lastContactedAt && lead.lastContactedAt < fourteenDaysAgo) {
        newStatus = 'Cold';
        newTemp = 'Cold';
        newScore = Math.max(0, lead.aiScore - 20);
      } else if (lead.lastContactedAt && lead.lastContactedAt < sevenDaysAgo) {
        newStatus = 'At_Risk';
        newTemp = 'Warm';
        newScore = Math.max(0, lead.aiScore - 10);
      }

      // 2. Source-based Scoring
      if (lead.source === 'Referral') newScore += 5;
      if (lead.source === 'Facebook' || lead.source === 'Google') newScore += 2;

      // Cap score at 100
      newScore = Math.min(100, newScore);

      // Update if changed
      if (newStatus !== lead.status || newScore !== lead.aiScore) {
        updates.push(
          prisma.lead.update({
            where: { id: lead.id },
            data: {
              status: newStatus,
              aiScore: newScore,
              temperature: newTemp
            }
          })
        );
      }
    }

    if (updates.length > 0) {
      await Promise.allSettled(updates);
    }
  } catch (error) {
    console.error("Failed to recalculate lead lifecycle:", error);
    throw error;
  }
}

export async function logOutreachActivity(leadId: string, content: string, type: string = 'Email') {
  try {
    await prisma.$transaction([
      prisma.activity.create({
        data: {
          leadId,
          type,
          content,
          date: new Date(),
        }
      }),
      prisma.lead.update({
        where: { id: leadId },
        data: {
          lastContactedAt: new Date(),
          status: 'Contacted' // Reset lifecycle on interaction
        }
      })
    ]);
    
    revalidatePath("/ai-hub");
    revalidatePath("/leads");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Error logging outreach:", error);
    return { success: false };
  }
}
