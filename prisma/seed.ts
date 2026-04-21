const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING DATABASE RESET (CLEARING DEMO DATA) ---');
  
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

  console.log('--- DEMO DATA CLEARED. ONLY ADMIN USER CREATED ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
