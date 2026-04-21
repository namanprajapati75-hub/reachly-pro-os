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

import { generateAIText } from "@/lib/ai";

export async function getAICOOBriefing() {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      urgentTasks,
      overdueTasks,
      hotLeads,
      ignoredLeads,
      atRiskClients,
      reportsDue,
      totalRevenue,
      totalPendingTasks
    ] = await Promise.all([
      prisma.task.findMany({
        where: { priority: { in: ['Urgent', 'High'] }, status: { not: 'Completed' } },
        include: { client: true },
        take: 5
      }),
      prisma.task.findMany({
        where: { dueDate: { lt: now }, status: { not: 'Completed' } },
        include: { client: true },
        take: 5
      }),
      prisma.lead.findMany({
        where: { aiScore: { gte: 80 }, status: { notIn: ['Won', 'Lost', 'Converted'] } },
        orderBy: { aiScore: 'desc' },
        take: 5
      }),
      prisma.lead.findMany({
        where: { lastContactedAt: { lt: sevenDaysAgo }, status: { notIn: ['Won', 'Lost', 'Converted'] } },
        take: 5
      }),
      prisma.report.findMany({
        where: { csatScore: { lt: 4 } },
        include: { client: true },
        take: 5
      }),
      prisma.report.findMany({
        where: { status: 'Draft' },
        include: { client: true },
        take: 5
      }),
      prisma.client.aggregate({
        _sum: { revenue: true }
      }),
      prisma.task.count({
        where: { status: { not: 'Completed' } }
      })
    ]);

    const revenueOpportunities = hotLeads.length * 5000; // Estimated $5k per hot lead
    const needsDelegation = totalPendingTasks > 15;

    // Generate AI Summary
    const statsSummary = `
      Urgent Tasks: ${urgentTasks.length}
      Overdue Tasks: ${overdueTasks.length}
      Hot Leads: ${hotLeads.length}
      Ignored Leads: ${ignoredLeads.length}
      Client Risks: ${atRiskClients.length}
      Draft Reports: ${reportsDue.length}
      Portfolio Revenue: $${totalRevenue._sum.revenue || 0}
      Rev Ops Potential: $${revenueOpportunities}
      Total Pending Tasks: ${totalPendingTasks}
      Delegation Recommended: ${needsDelegation ? 'Yes' : 'No'}
    `;

    const prompt = `You are the AI COO of Reachly Pro OS. Based on these agency stats, generate a concise, high-impact 3-sentence founder briefing. Be direct, authoritative, and growth-oriented. Avoid flowery language.
    Stats: ${statsSummary}`;

    const defaultBriefing = "Ops status: Stable. Portfolio generating consistent revenue. Action focus: ${hotLeads.length} hot leads ready for closing. ${urgentTasks.length} urgent tasks require immediate attention.";
    
    const briefing = await generateAIText(prompt, defaultBriefing);

    return {
      briefing,
      urgentTasks,
      overdueTasks,
      hotLeads,
      ignoredLeads,
      atRiskClients,
      reportsDue,
      revenueOpportunities
    };
  } catch (error) {
    console.error("Failed to fetch AI COO briefing:", error);
    throw error;
  }
}

export async function getLeadSalesIntelligence(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { activities: true, client: true }
    });

    if (!lead) throw new Error("Lead not found");

    const prompt = `You are an expert sales closer. Analyze this lead and provide:
    1. A single high-converting suggested reply message.
    2. The "Best Offer" to close them right now.
    3. Recommended follow-up timing (e.g. "Send in 2 hours").
    4. A concise strategic advice (Next Action).
    
    Lead Name: ${lead.name}
    Company: ${lead.company}
    Score: ${lead.aiScore}%
    Temperature: ${lead.temperature}
    Last Activities: ${JSON.stringify(lead.activities.slice(-3))}
    
    Return the response ONLY in this exact format:
    REPLY: [message]
    OFFER: [offer]
    TIMING: [timing]
    ADVICE: [advice]`;

    const defaultReply = `Hi ${lead.name}, I've been reviewing your profile at ${lead.company}. I'd love to show you how our AI systems can specifically boost your current efficiency. Are you free for a 10min sync tomorrow?`;
    const defaultIntel = `REPLY: ${defaultReply}\nOFFER: 15% discount on the first 3 months if closed this week.\nTIMING: Send immediately.\nADVICE: Highlight recent success with similar agencies.`;

    const rawIntel = await generateAIText(prompt, defaultIntel);

    // Parse the response
    const replyMatch = rawIntel.match(/REPLY: (.*)/);
    const offerMatch = rawIntel.match(/OFFER: (.*)/);
    const timingMatch = rawIntel.match(/TIMING: (.*)/);
    const adviceMatch = rawIntel.match(/ADVICE: (.*)/);

    return {
      suggestedReply: replyMatch ? replyMatch[1] : defaultReply,
      bestOffer: offerMatch ? offerMatch[1] : "Custom strategy package",
      followUpTiming: timingMatch ? timingMatch[1] : "Follow up tomorrow morning",
      nextAction: adviceMatch ? adviceMatch[1] : "Book a discovery call"
    };
  } catch (error) {
    console.error("Failed to get sales intelligence:", error);
    return null;
  }
}

export async function getClientContentIdeas(clientId: string) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client) throw new Error("Client not found");

    const prompt = `You are a high-end content strategist for a billionaire-founder agency. Generate content ideas for this client:
    
    Name: ${client.name}
    Company: ${client.company}
    Annual Value: $${client.revenue}
    
    Provide exactly:
    - 5 Viral Reel/Video Hooks
    - 3 High-converting Ad Copy variations
    - 3 Promotional Offer ideas
    - 5 Local Awareness/Standard content ideas
    
    Return the response as a clean, structured list of ideas.`;

    const defaultIdeas = "1. Why we chose ${client.company} for our portfolio.\n2. The strategy behind our latest success.\n3. How ${client.name} is scaling operations.\n4. Quality over quantity in growth.\n5. Exclusive behind-the-scenes at ${client.company}.";
    
    const content = await generateAIText(prompt, defaultIdeas);
    return content;
  } catch (error) {
    console.error("Failed to generate content ideas:", error);
    return null;
  }
}

export async function getRevenueIntelligence() {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      clients,
      hotLeads,
      ignoredLeads,
      overdueTasks,
      reports
    ] = await Promise.all([
      prisma.client.findMany({ include: { tasks: true, reports: true } }),
      prisma.lead.findMany({ where: { aiScore: { gte: 80 }, status: { notIn: ['Won', 'Lost', 'Converted'] } }, orderBy: { aiScore: 'desc' } }),
      prisma.lead.findMany({ where: { lastContactedAt: { lt: sevenDaysAgo }, status: { notIn: ['Won', 'Lost', 'Converted'] } } }),
      prisma.task.findMany({ where: { dueDate: { lt: now }, status: { not: 'Completed' } } }),
      prisma.report.findMany({ include: { client: true } })
    ]);

    // 1. Clients ready for upsell (High revenue, High CSAT, few tasks)
    const upsellCandidates = clients.filter(c => {
      const avgCsat = c.reports.reduce((acc, r) => acc + (r.csatScore || 0), 0) / (c.reports.length || 1);
      return avgCsat > 4.5 && c.revenue > 10000;
    }).slice(0, 3);

    // 2. Clients likely to churn (Low CSAT or high overdue tasks)
    const churnRisks = clients.filter(c => {
      const avgCsat = c.reports.reduce((acc, r) => acc + (r.csatScore || 0), 0) / (c.reports.length || 1);
      const hostOverdue = overdueTasks.filter(t => t.clientId === c.id).length;
      return avgCsat < 3.5 || hostOverdue > 2;
    }).slice(0, 3);

    const totalRevenue = clients.reduce((acc, c) => acc + c.revenue, 0);
    const pipelineValue = hotLeads.length * 5000;
    const monthlyForecast = (totalRevenue / 12) + (pipelineValue * 0.2); // Simple projection

    // AI Revenue Recommendation
    const prompt = `You are a chief revenue officer for a high-end agency. Based on these stats:
    Upsell Candidates: ${upsellCandidates.length}
    Churn Risks: ${churnRisks.length}
    Leads in Pipeline: ${hotLeads.length}
    Revenue Leaks: $${(ignoredLeads.length * 2000) + (overdueTasks.length * 500)}
    
    Provide a single strategic "Revenue Recommendation" under 20 words.`;
    
    const defaultRec = "Focus on closing hot leads while clearing sales bottlenecks to stop revenue leakage.";
    const aiRecommendation = await generateAIText(prompt, defaultRec);

    return {
      upsellCandidates,
      highestValueLeads: hotLeads.slice(0, 5),
      churnRisks,
      monthlyForecast,
      aiRecommendation,
      revenueLeaks: {
        ignoredLeadsCount: ignoredLeads.length,
        overdueTasksCount: overdueTasks.length,
        potentialLoss: (ignoredLeads.length * 2000) + (overdueTasks.length * 500)
      }
    };
  } catch (error) {
    console.error("Failed to get revenue intelligence:", error);
    throw error;
  }
}

export async function getTeamProductivity() {
  try {
    const now = new Date();

    const tasks = await prisma.task.findMany({
      where: { assignedTo: { not: null } },
      orderBy: { createdAt: 'desc' }
    });

    const roles = ['Editor', 'Sales'];
    const productivity: any = {};

    roles.forEach(role => {
      const roleTasks = tasks.filter(t => t.assignedRole === role);
      const pending = roleTasks.filter(t => t.status !== 'Completed');
      const completed = roleTasks.filter(t => t.status === 'Completed');
      const overdue = pending.filter(t => t.dueDate && t.dueDate < now);

      productivity[role] = {
        pendingCount: pending.length,
        completedCount: completed.length,
        overdueCount: overdue.length,
        backlog: pending.slice(0, 5)
      };
    });

    // Completed tasks leaderboard
    const users = [...new Set(tasks.map(t => t.assignedTo))];
    const leaderboard = users.map(user => ({
      name: user,
      completed: tasks.filter(t => t.assignedTo === user && t.status === 'Completed').length
    })).sort((a, b) => b.completed - a.completed);

    return {
      productivity,
      leaderboard,
      slowResponseWarnings: tasks.filter(t => t.status !== 'Completed' && t.dueDate && t.dueDate < now).length > 3
    };
  } catch (error) {
    console.error("Failed to get team productivity:", error);
    throw error;
  }
}

export async function getAutopilotSummary() {
  try {
    const [coo, revenue, team] = await Promise.all([
      getAICOOBriefing(),
      getRevenueIntelligence(),
      getTeamProductivity()
    ]);

    const prompt = `You are the ultimate AI Agent for a Billionaire Agency Founder.
    Based on the following data, generate a one-sentence "Strategic Founder Focus" for today.
    COO: ${coo.briefing}
    Revenue: Forecast $${revenue.monthlyForecast}
    Team: ${team.slowResponseWarnings ? 'Deceleration detected' : 'Operational steady'}
    
    Return ONLY the one-sentence focus.`;

    const focus = await generateAIText(prompt, "Focus on closing the highest value pipeline leads while stabilizing secondary retention metrics.");

    return {
      todayPriorities: coo.urgentTasks.slice(0, 3).map(t => t.title),
      whoToContact: revenue.highestValueLeads.slice(0, 3).map(l => ({ name: l.name, reason: "High probability close" })),
      tasksToFinish: coo.overdueTasks.slice(0, 3).map(t => t.title),
      revenueOpportunities: revenue.upsellCandidates.slice(0, 2).map(c => `Upsell ${c.company}`),
      teamBottlenecks: team.productivity.Editor.overdueCount > 0 ? "Editor backlog clearing" : "None detected",
      clientAlerts: coo.atRiskClients.slice(0, 2).map(c => `${c.client.company} - Risk`),
      suggestedFounderFocus: focus
    };
  } catch (error) {
    console.error("Failed to get autopilot summary:", error);
    throw error;
  }
}
