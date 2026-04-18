import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateClientReport } from '@/app/actions/reports';
import { logSystemActivity } from '@/lib/activityLogger';

export async function GET(req: Request) {
  try {
    // 1. Verify CRON_SECRET
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (process.env.NODE_ENV === 'production') {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }

    // 2. Fetch all Active Clients
    const activeClients = await prisma.client.findMany({
      where: { status: 'Active' },
      select: { id: true, name: true }
    });

    if (activeClients.length === 0) {
      return NextResponse.json({ success: true, message: 'No active clients to process' });
    }

    // 3. Generate Reports in loop (or optimally in batches, but loop is fine for now)
    let generated = 0;
    for (const client of activeClients) {
      try {
        const result = await generateClientReport(client.id);
        if (result.success) generated++;
      } catch (e) {
        console.error(`Failed pushing report for ${client.id}`, e);
      }
    }

    await logSystemActivity({
      type: "MONTHLY_REPORTS_GENERATED",
      content: `Cron Engine successfully deployed ${generated} monthly client reports.`,
      generateNotification: true,
      notificationLink: '/reports'
    });

    return NextResponse.json({ success: true, count: generated, message: 'Monthly reports built' });

  } catch (error: any) {
    console.error('Monthly reports cron error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
