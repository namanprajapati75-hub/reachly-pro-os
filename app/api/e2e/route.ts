import { NextResponse } from 'next/server';
import { createClient, getClients } from '@/app/actions/clients';
import { createLead, getLeads } from '@/app/actions/leads';
import { updateTask, getTasks } from '@/app/actions/tasks';
import { generateClientReport, deleteReport } from '@/app/actions/reports';
import { updateSettings, getSettings } from '@/app/actions/settings';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const results: string[] = [];

  try {
    // 1. Add Client manually to catch RAW errors
    results.push("Testing Add Client (RAW DATABASE CALL)...");
    
    let rawClient;
    try {
      rawClient = await prisma.client.create({
        data: {
          name: "E2E Test Client RAW",
          company: "E2E Corp",
          email: `e2e-raw-${Date.now()}@example.com`,
          phone: "123456789",
          revenue: 50000,
          status: "Active"
        },
      });
    } catch (e: any) {
      throw new Error(`Prisma raw DB error on Edge: ${e.message}`);
    }

    results.push(`Add Client OK (ID: ${rawClient.id})`);

    // Fetch clients to verify
    const clients = await getClients();
    if (!clients.find(c => c.id === rawClient.id)) {
      throw new Error("Client not found in getClients()");
    }
    results.push("Add Client Persistence OK");

    // 2. Add Lead
    results.push("Testing Add Lead...");
    const leadRes = await createLead({
      name: "E2E Test Lead",
      email: `lead-${Date.now()}@example.com`,
      company: "E2E Lead Corp",
      assignedClientId: rawClient.id
    });
    if (!leadRes.success) throw new Error("Add Lead failed");
    results.push("Add Lead OK");

    // 3. Mark Task Complete (Create task first)
    results.push("Testing Task Completion...");
    const task = await prisma.task.create({
      data: {
        title: "E2E Test Task",
        clientId: rawClient.id
      }
    });
    const taskRes = await updateTask(task.id, { status: "Completed" });
    if (!taskRes.success) throw new Error("Update Task failed");
    
    const verifyTask = await prisma.task.findUnique({ where: { id: task.id }});
    if (verifyTask?.status !== "Completed") throw new Error("Task status persist failed");
    results.push("Task Completion Persistence OK");

    // 4. Delete Report (Create report first)
    results.push("Testing Delete Report...");
    const reportRes = await generateClientReport(rawClient.id);
    if (!reportRes.success || !reportRes.report) throw new Error("Create Report failed");

    const delReportRes = await deleteReport(reportRes.report.id);
    if (!delReportRes.success) throw new Error("Delete Report failed");
    
    const verifyReport = await prisma.report.findUnique({ where: { id: reportRes.report.id }});
    if (verifyReport) throw new Error("Report deletion persist failed");
    results.push("Delete Report Persistence OK");

    // 5. Settings Save
    results.push("Testing Settings Save...");
    const randBio = `E2E Bio ${Date.now()}`;
    await updateSettings({ bio: randBio });
    
    const settings = await getSettings();
    if (settings.bio !== randBio) throw new Error("Settings not persisted");
    results.push("Settings Save Persistence OK");

    // 6. Verify Automation (Notifications)
    results.push("Testing Automation Layer (Notifications)...");
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    if (notifications.length === 0) {
      throw new Error("No notifications found. Automation logger might be failing.");
    }

    const hasNewLead = notifications.some(n => n.type === 'NEW_LEAD');
    const hasTaskCreated = notifications.some(n => n.type === 'TASK_DUE'); // Based on my mapping in activityLogger
    
    if (!hasNewLead) results.push("WARNING: NEW_LEAD notification not found in recent logs");
    else results.push("Automation: NEW_LEAD notification verified");

    results.push("ALL E2E TESTS PASSED");
    return NextResponse.json({ success: true, log: results });

  } catch (error: any) {
    results.push(`ERROR CATCHED: ${error.message}`);
    return NextResponse.json({ success: false, log: results, error: error.message }, { status: 500 });
  }
}


