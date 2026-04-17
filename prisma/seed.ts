const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up existing data...');
  
  // Order matters due to foreign key constraints
  await prisma.activity.deleteMany();
  await prisma.note.deleteMany();
  await prisma.task.deleteMany();
  await prisma.report.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();

  console.log('Seeding Relational Reachly Pro OS database...');

  // 1. Users (Team members)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@reachly.io',
      name: 'Agency Admin',
      role: 'admin',
    },
  });

  // 2. Clients
  const client1 = await prisma.client.create({
    data: {
      name: 'John Nexus',
      company: 'Nexus Digital',
      email: 'john@nexus.com',
      status: 'Active',
      revenue: 5500,
      notes: { create: { content: 'High value partner. Focused on SEO and PPC.' } },
      tasks: {
        create: [
          { title: 'Q2 Strategy Review', priority: 'High', status: 'In_Progress', dueDate: new Date() },
          { title: 'Meta Ads Audit', priority: 'Medium', status: 'Todo' },
        ]
      },
      activities: {
        create: [
          { type: 'Meeting', content: 'Onboarding call completed successfully.', date: new Date() },
        ]
      }
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'Sophia Apex',
      company: 'Apex Design',
      email: 'sophia@apex.design',
      status: 'Active',
      revenue: 4200,
    },
  });

  // 3. Leads
  await prisma.lead.createMany({
    data: [
      { name: 'Marcus Thorne', email: 'm.thorne@luxestates.com', company: 'Luxe Estates', source: 'Google Ads', status: 'Hot' },
      { name: 'Elena Rodriguez', email: 'elena@greenleaf.org', company: 'GreenLeaf NGO', source: 'Referral', status: 'Warm' },
      { name: 'Sarah Rivera', email: 's.rivera@techflow.io', company: 'TechFlow', source: 'Facebook', status: 'Cold' },
      { name: 'David Chen', email: 'd.chen@modernliving.com', company: 'Modern Living', source: 'Website', status: 'Converted', assignedClientId: client1.id },
    ],
  });

  console.log('Database seeded successfully with relational agency data.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
