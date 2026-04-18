
import { getNotifications, markAllNotificationsRead } from './app/actions/notifications';
import { createLead } from './app/actions/leads';
import { createClient } from './app/actions/clients';
import { createTask } from './app/actions/tasks';
import { prisma } from './lib/prisma';

async function testAutomation() {
  console.log('--- Starting Automation Layer Test ---');

  // 1. Test Client Action -> Activity Log
  console.log('Testing Client Activity Log...');
  const clientRes = await createClient({
    name: "Automation Test Client",
    company: "AutoCorp",
    email: `auto-${Date.now()}@test.com`,
    phone: "123456",
    status: "Active",
    revenue: 1000
  });

  // 2. Test Lead Action -> Notification
  console.log('Testing Lead Notification...');
  const leadRes = await createLead({
    name: "Automation Test Lead",
    email: `autolead-${Date.now()}@test.com`,
    source: "Automation Test",
    assignedClientId: clientRes.success ? clientRes.client?.id : undefined
  });

  // 3. Test Task Action -> Notification
  console.log('Testing Task Notification...');
  if (clientRes.success) {
    await createTask({
      title: "Automation Task",
      priority: "Urgent",
      clientId: clientRes.client?.id
    });
  }

  // 4. Verify Notifications
  console.log('Verifying Notifications in DB...');
  const notifications = await getNotifications();
  console.log(`Found ${notifications.length} notifications.`);
  notifications.slice(0, 3).forEach(n => {
    console.log(`- [${n.type}] ${n.title}: ${n.message} (Read: ${n.isRead})`);
  });

  if (notifications.length >= 2) {
    console.log('SUCCESS: Notifications generated successfully.');
  } else {
    console.log('FAILURE: No notifications found.');
  }

  console.log('--- Automation Layer Test Complete ---');
}

testAutomation().catch(console.error);
