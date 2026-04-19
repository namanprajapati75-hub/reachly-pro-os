const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING BILLIONAIRE FOUNDER SEEDING ---');
  
  // Clean up
  await prisma.activity.deleteMany();
  await prisma.note.deleteMany();
  await prisma.task.deleteMany();
  await prisma.report.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();

  // 1. Core Users
  const admin = await prisma.user.create({
    data: {
      email: 'founder@reachly.io',
      name: 'Alpha Founder',
      role: 'admin',
    },
  });

  // 2. Premium Clients (10)
  const clientsData = [
    { name: 'Alexander Sterling', company: 'Sterling Global Equities', email: 'a.sterling@sterling.com', revenue: 25000, status: 'Active' },
    { name: 'Isabella Vance', company: 'Vance Luxury Travel', email: 'isabella@vance.luxury', revenue: 15000, status: 'Active' },
    { name: 'Dr. Julian Thorne', company: 'Thorne Biotech', email: 'julian@thornebio.com', revenue: 45000, status: 'Active' },
    { name: 'Elena Rossi', company: 'Rossi Fashion House', email: 'elena@rossi.it', revenue: 12000, status: 'Active' },
    { name: 'Marcus Chen', company: 'Chen Real Estate Group', email: 'm.chen@chenrealestate.com', revenue: 8000, status: 'Active' },
    { name: 'Sarah Jenkins', company: 'Jenkins Law Firm', email: 'sarah@jenkinslaw.com', revenue: 5000, status: 'Active' },
    { name: 'Oliwer Knight', company: 'Knight Security Solutions', email: 'oliwer@knightsecurity.net', revenue: 22000, status: 'Active' },
    { name: 'Sophia Wu', company: 'Wu Fine Arts', email: 'sophia@wuart.com', revenue: 9500, status: 'Active' },
    { name: 'Viktor Drago', company: 'Iron Forge Fitness', email: 'viktor@ironforge.com', revenue: 3500, status: 'Active' },
    { name: 'Mia Thompson', company: 'Green Horizon Energy', email: 'mia@greenhorizon.io', revenue: 18000, status: 'Active' },
  ];

  const clients = [];
  for (const c of clientsData) {
    const client = await prisma.client.create({ data: c });
    clients.push(client);
  }

  // 3. Leads (Pipeline)
  const leadsData = [
    { name: 'Harvey Specter', email: 'harvey@pearson-hardman.com', company: 'Pearson Hardman', status: 'In_Progress', aiScore: 95, temperature: 'Hot', source: 'Referral' },
    { name: 'Mike Ross', email: 'mike@techstart.io', company: 'TechStart Inc', status: 'New', aiScore: 88, temperature: 'Hot', source: 'Google' },
    { name: 'Rachel Zane', email: 'rachel@legal-analytics.com', company: 'Zane Legal', status: 'In_Progress', aiScore: 72, temperature: 'Warm', source: 'Facebook' },
    { name: 'Louis Litt', email: 'louis@litt-efficiency.com', company: 'Litt Efficiency', status: 'At_Risk', aiScore: 45, temperature: 'Warm', source: 'LinkedIn', lastContactedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    { name: 'Donna Paulsen', email: 'donna@executive-ops.com', company: 'Executive Ops', status: 'Won', aiScore: 100, temperature: 'Hot', source: 'Direct', assignedClientId: clients[0].id },
    { name: 'Jessica Pearson', email: 'jessica@global-strategy.com', company: 'Pearson Ventures', status: 'Contacted', aiScore: 92, temperature: 'Hot', source: 'Referral' },
    { name: 'Robert Zane', email: 'robert@zane-holdings.com', company: 'Zane Holdings', status: 'Lost', aiScore: 30, temperature: 'Cold', source: 'Website' },
    { name: 'Katrina Bennett', email: 'katrina@efficient-law.com', company: 'Bennett & Co', status: 'New', aiScore: 65, temperature: 'Warm', source: 'Google' },
  ];

  for (const l of leadsData) {
    await prisma.lead.create({ data: l });
  }

  // 4. Tasks (Pending, Overdue, High Priority)
  const now = new Date();
  const tasksData = [
    { title: 'Close Sterling Upsell', priority: 'Urgent', status: 'Open', dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), clientId: clients[0].id, assignedTo: 'Jason Sales', assignedRole: 'Sales' },
    { title: 'Review Vance Security Audit', priority: 'High', status: 'In_Progress', dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), clientId: clients[1].id, assignedTo: 'Emily Editor', assignedRole: 'Editor' }, // Overdue
    { title: 'Onboard Thorne Biotech', priority: 'High', status: 'Open', dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), clientId: clients[2].id, assignedTo: 'Jason Sales', assignedRole: 'Sales' },
    { title: 'Monthly Performance Report', priority: 'Medium', status: 'Completed', dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), clientId: clients[3].id, assignedTo: 'Emily Editor', assignedRole: 'Editor' },
    { title: 'Fix Rossi Ad Campaign', priority: 'Urgent', status: 'Open', dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), clientId: clients[3].id, assignedTo: 'Emily Editor', assignedRole: 'Editor' }, // Overdue
    { title: 'Booking call with Wu Arts', priority: 'Medium', status: 'Open', dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), clientId: clients[7].id, assignedTo: 'Jason Sales', assignedRole: 'Sales' },
  ];

  for (const t of tasksData) {
    await prisma.task.create({ data: t });
  }

  // 5. Reports (CSAT Risk)
  const reportsData = [
    { title: 'Sterling Q1 Growth', csatScore: 4.9, status: 'Sent', clientId: clients[0].id },
    { title: 'Vance Quarterly Review', csatScore: 4.8, status: 'Sent', clientId: clients[1].id },
    { title: 'Viktor Drago Campaign', csatScore: 2.5, status: 'Sent', clientId: clients[8].id }, // LOW CSAT RISK
    { title: 'Rossi Fashion Insights', status: 'Draft', clientId: clients[3].id }, // REPORT DUE SOON
  ];

  for (const r of reportsData) {
    await prisma.report.create({ data: r });
  }

  // 6. Activities
  for (let i = 0; i < 20; i++) {
    await prisma.activity.create({
      data: {
        type: i % 2 === 0 ? 'Email' : 'Call',
        content: `Standard operation sync #${i}`,
        clientId: clients[i % 10].id,
      }
    });
  }

  console.log('--- BILLIONAIRE FOUNDER SEEDING COMPLETE ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
