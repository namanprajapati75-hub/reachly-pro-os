const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Reachly OS database...');

  // Leads
  await prisma.lead.createMany({
    data: [
      { name: 'Alex Rivera', email: 'alex@techflow.io', company: 'TechFlow', source: 'Google Ads', status: 'Hot', notes: 'Interested in SEO & PPC bundle.' },
      { name: 'Sarah Chen', email: 'sarah@chenmedia.com', company: 'Chen Media', source: 'Facebook', status: 'Warm', notes: 'Follow up on Monday.' },
      { name: 'Marcus Thorne', email: 'm.thorne@luxestates.com', company: 'Luxe Estates', source: 'Website', status: 'Hot', notes: 'High intent real estate lead.' },
      { name: 'Elena Rodriguez', email: 'elena@greenleaf.org', company: 'GreenLeaf Org', source: 'Referral', status: 'Cold', notes: 'Inquiry about non-profit discounts.' },
    ],
  });

  // Clients
  await prisma.client.createMany({
    data: [
      { name: 'John Doe', company: 'Nexus Corp', email: 'john@nexus.com', status: 'Active', revenue: 5000 },
      { name: 'Jane Smith', company: 'Apex Design', email: 'jane@apex.design', status: 'Active', revenue: 3500 },
      { name: 'Robert Brown', company: 'Vortex Inc', email: 'robert@vortex.io', status: 'Paused', revenue: 7500 },
    ],
  });

  // Tasks
  await prisma.task.createMany({
    data: [
      { title: 'Update Q1 Meta Ad Creative', priority: 'High', status: 'In_Progress', dueDate: new Date() },
      { title: 'Client Onboarding: Nexus Corp', priority: 'High', status: 'Done', dueDate: new Date() },
      { title: 'Weekly Reports Generation', priority: 'Medium', status: 'Todo', dueDate: new Date() },
      { title: 'Research AI Lead Attribution', priority: 'Low', status: 'Todo' },
    ],
  });

  // Revenue
  await prisma.revenue.createMany({
    data: [
      { amount: 15000, source: 'Monthly Retainers' },
      { amount: 2500, source: 'One-off Setup' },
      { amount: 5000, source: 'Ad Spend Markup' },
    ],
  });

  // Campaigns
  await prisma.campaign.createMany({
    data: [
      { name: 'Real Estate Growth', platform: 'Meta', spend: 2000, revenue: 12000, status: 'Running' },
      { name: 'SaaS Lead Gen', platform: 'Google', spend: 1500, revenue: 8500, status: 'Running' },
      { name: 'Winter Retargeting', platform: 'Meta', spend: 500, revenue: 2500, status: 'Ended' },
    ],
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
