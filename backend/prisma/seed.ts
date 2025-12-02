import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ================== Helpers ==================

function randomFrom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function calculateMonthlySip(
  targetAmount: number,
  annualReturnPercent: number,
  months: number,
): number {
  const r = annualReturnPercent / 100 / 12;
  if (r <= 0) return targetAmount / months;
  const factor = Math.pow(1 + r, months) - 1;
  return (targetAmount * r) / factor;
}

function monthsFromNow(months: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d;
}

const MODEL_PORTFOLIOS = {
  Conservative: [
    { schemeName: 'FinXpert Liquid Fund', allocationPercent: 30 },
    { schemeName: 'FinXpert Short Term Debt', allocationPercent: 50 },
    { schemeName: 'FinXpert Balanced Fund', allocationPercent: 20 },
  ],
  Moderate: [
    { schemeName: 'FinXpert Balanced Fund', allocationPercent: 40 },
    { schemeName: 'FinXpert Large Cap Equity', allocationPercent: 40 },
    { schemeName: 'FinXpert Mid Cap Equity', allocationPercent: 20 },
  ],
  Aggressive: [
    { schemeName: 'FinXpert Large Cap Equity', allocationPercent: 30 },
    { schemeName: 'FinXpert Mid Cap Equity', allocationPercent: 40 },
    { schemeName: 'FinXpert Small Cap Equity', allocationPercent: 30 },
  ],
} as const;

// ================== Seed Advisor ==================

async function seedAdvisor() {
  let advisor = await prisma.advisor.findFirst();

  if (!advisor) {
    advisor = await prisma.advisor.create({
      data: {
        name: 'Demo Advisor',
        email: 'advisor@finxpert.test',
        phone: '9999999999',
        passwordHash: 'demo-hash',
      },
    });
  }

  return advisor;
}

// ================== Seed Clients ==================

async function seedClients(advisorId: string) {
  let clients = await prisma.client.findMany();
  const needed = 5 - clients.length;

  const riskLevels = ['Conservative', 'Moderate', 'Aggressive'];

  for (let i = 0; i < needed; i++) {
    const index = clients.length + i + 1;

    const client = await prisma.client.create({
      data: {
        name: `Demo Client ${index}`,
        email: `demo${index}@finxpert.test`,
        phone: `99900000${index}`,
        advisorId,
        riskLevel: randomFrom(riskLevels),
        age: 25 + (index % 20),
        income: 500000 + index * 50000,
        dependents: index % 3,
        currentInsurance: 500000 + index * 100000,
      },
    });

    clients.push(client);
  }

  return clients.slice(0, 5);
}

// ================== Seed Loans ==================

async function seedLoans(clients: any[]) {
  console.log('Creating demo loans...');
  const purposes = [
    'Business expansion',
    'Home renovation',
    'Education',
    'Car purchase',
    'Debt consolidation',
  ];

  for (let i = 0; i < 10; i++) {
    const client = clients[i % clients.length];

    const status: 'PENDING' | 'APPROVED' | 'DISBURSED' =
      i < 3 ? 'PENDING' : i < 7 ? 'APPROVED' : 'DISBURSED';

    await prisma.loanApplication.create({
      data: {
        clientId: client.id,
        amount: 100000 + i * 50000,
        tenureMonths: 12 + (i % 4) * 12,
        interestRate: 10 + (i % 5),
        purpose: randomFrom(purposes),
        status,
        statusHistory: {
          create: [
            {
              fromStatus: null,
              toStatus: 'PENDING',
              comment: 'Loan application created (seed)',
              changedBy: 'SYSTEM_SEED',
            },
            ...(status !== 'PENDING'
              ? [
                  {
                    fromStatus: 'PENDING' as const,
                    toStatus: status,
                    comment: `Auto moved to ${status} (seed)`,
                    changedBy: 'SYSTEM_SEED',
                  },
                ]
              : []),
          ],
        },
      },
    });
  }

  console.log('✅ 10 demo loans created');
}

// ================== Seed Goals ==================

async function seedGoals(clients: any[]) {
  console.log('Creating demo goals...');

  const goalDefs: {
    name: string;
    type:
      | 'RETIREMENT'
      | 'EDUCATION'
      | 'WEALTH_CREATION'
      | 'CAR'
      | 'HOUSE'
      | 'OTHER';
    months: number;
    risk: 'Conservative' | 'Moderate' | 'Aggressive';
    target: number;
  }[] = [
    {
      name: 'Retirement',
      type: 'RETIREMENT',
      months: 240,
      risk: 'Aggressive',
      target: 15000000,
    },
    {
      name: 'Education',
      type: 'EDUCATION',
      months: 180,
      risk: 'Moderate',
      target: 8000000,
    },
    {
      name: 'House',
      type: 'HOUSE',
      months: 120,
      risk: 'Moderate',
      target: 12000000,
    },
    {
      name: 'Car',
      type: 'CAR',
      months: 48,
      risk: 'Conservative',
      target: 1500000,
    },
    {
      name: 'Wealth',
      type: 'WEALTH_CREATION',
      months: 180,
      risk: 'Aggressive',
      target: 10000000,
    },
  ];

  for (let i = 0; i < 10; i++) {
    const client = clients[i % clients.length];
    const def = goalDefs[i % goalDefs.length];

    const assumedReturn =
      def.risk === 'Aggressive' ? 13 : def.risk === 'Moderate' ? 11 : 9;

    const requiredSip = calculateMonthlySip(def.target, assumedReturn, def.months);

    await prisma.goal.create({
      data: {
        clientId: client.id,
        name: `${def.name} Goal (${client.name})`,
        description: `Seeded goal for ${client.name}`,
        goalType: def.type,
        targetAmount: def.target,
        targetDate: monthsFromNow(def.months),
        currentAmount: def.target * 0.1,
        requiredMonthlySip: requiredSip,
        assumedReturnPa: assumedReturn,
        riskProfile: def.risk,
        status: 'ACTIVE',
        recommendations: {
          createMany: {
            data: MODEL_PORTFOLIOS[def.risk].map((p) => ({
              schemeName: p.schemeName,
              allocationPercent: p.allocationPercent,
            })),
          },
        },
      },
    });
  }

  console.log('✅ 10 demo goals created');
}

// ================== MAIN ==================

async function main() {
  console.log('🌱 Seeding FinXpert demo data...');

  // clean dependent tables
  await prisma.loanStatusHistory.deleteMany({});
  await prisma.loanApplication.deleteMany({});
  await prisma.goalRecommendation.deleteMany({});
  await prisma.goal.deleteMany({});

  const advisor = await seedAdvisor();
  const clients = await seedClients(advisor.id);
  await seedLoans(clients);
  await seedGoals(clients);

  console.log('✅ Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
