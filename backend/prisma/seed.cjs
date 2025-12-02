// prisma/seed.cjs
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create advisor
  const advisor = await prisma.advisor.upsert({
    where: { email: 'demo@advisor.com' },
    update: {},
    create: {
      name: 'Demo Advisor',
      email: 'demo@advisor.com',
      phone: '9999999999',
      passwordHash: 'demo-hash', // ideally bcrypt-hashed
    },
  });

  // Create clients
  const client1 = await prisma.client.create({
    data: {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '9876543210',
      riskLevel: 'MEDIUM',
      age: 35,
      income: 1200000,
      dependents: 2,
      currentInsurance: 500000,
      aum: 1500000,
      advisorId: advisor.id,
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'Anita Jain',
      email: 'anita@example.com',
      phone: '9876500000',
      riskLevel: 'HIGH',
      age: 29,
      income: 1800000,
      dependents: 0,
      currentInsurance: 300000,
      aum: 2500000,
      advisorId: advisor.id,
    },
  });

  // Sample SIP
  await prisma.sipPlan.create({
    data: {
      clientId: client1.id,
      amount: 10000,
      dayOfMonth: 5,
    },
  });

  // Sample portfolio
  await prisma.portfolio.create({
    data: {
      clientId: client1.id,
      type: 'MF',
      value: 500000,
      product: 'Nifty 50 Index Fund',
    },
  });

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
