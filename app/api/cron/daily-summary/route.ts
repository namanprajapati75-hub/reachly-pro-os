import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logSystemActivity } from '@/lib/activityLogger';

export async function GET(req: Request) {
  try {
    // 1. Verify CRON_SECRET
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // In local dev, we might bypass it or provide it. In prod, strict requirement.
    if (process.env.NODE_ENV === 'production') {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }

    // 2. Compute Daily Summary
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [newLeads, completedTasks, upcomingTasks] = await Promise.all([
      prisma.lead.count({ where: { createdAt: { gte: yesterday } } }),
      prisma.task.count({ where: { status: 'Completed', updatedAt: { gte: yesterday } } }),
      prisma.task.count({ 
        where: { 
          status: { not: 'Completed' }, 
          dueDate: { lte: new Date(now.getTime() + 48 * 60 * 60 * 1000) } 
        } 
      })
    ]);

    const summaryContent = `Morning Summary: ${newLeads} new leads captured yesterday. ${completedTasks} tasks were cleared. You have ${upcomingTasks} tasks due soon.`;

    await logSystemActivity({
      type: "DAILY_SUMMARY",
      content: summaryContent,
      generateNotification: true,
      notificationLink: '/'
    });

    return NextResponse.json({ success: true, message: 'Daily summary generated' });

  } catch (error: any) {
    console.error('Daily summary cron error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
