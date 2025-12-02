-- CreateEnum
CREATE TYPE "MfOrderType" AS ENUM ('BUY', 'SELL', 'SIP');

-- CreateEnum
CREATE TYPE "MfOrderStatus" AS ENUM ('INITIATED', 'PENDING', 'ALLOTTED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SipMandateStatus" AS ENUM ('CREATED', 'PENDING', 'ACTIVE', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InsuranceProposalStatus" AS ENUM ('CREATED', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LoanType" AS ENUM ('PERSONAL', 'HOME', 'CAR');

-- CreateEnum
CREATE TYPE "LoanApplicationStatus" AS ENUM ('CREATED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'DISBURSED');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'DISBURSED', 'CLOSED');

-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('RETIREMENT', 'EDUCATION', 'WEALTH_CREATION', 'CAR', 'HOUSE', 'OTHER');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "MutualFundOrder" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "schemeCode" TEXT NOT NULL,
    "isin" TEXT,
    "type" "MfOrderType" NOT NULL,
    "status" "MfOrderStatus" NOT NULL DEFAULT 'INITIATED',
    "amount" DOUBLE PRECISION NOT NULL,
    "units" DOUBLE PRECISION,
    "navAtOrder" DOUBLE PRECISION,
    "externalOrderId" TEXT,
    "broker" TEXT,
    "errorMessage" TEXT,
    "placedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MutualFundOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SipMandate" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "bankAccount" TEXT NOT NULL,
    "umrn" TEXT,
    "status" "SipMandateStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "debitAmount" DOUBLE PRECISION,
    "frequency" TEXT,
    "startDate" TIMESTAMP(3),

    CONSTRAINT "SipMandate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceProduct" (
    "id" TEXT NOT NULL,
    "insurer" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "minAge" INTEGER NOT NULL,
    "maxAge" INTEGER NOT NULL,
    "basePremium" DOUBLE PRECISION NOT NULL,
    "baseSum" INTEGER NOT NULL,

    CONSTRAINT "InsuranceProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceProposal" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "insurer" TEXT NOT NULL,
    "sumAssured" INTEGER NOT NULL,
    "tenureYears" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "smoker" BOOLEAN NOT NULL,
    "premiumMonthly" DOUBLE PRECISION NOT NULL,
    "status" "InsuranceProposalStatus" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InsuranceProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanProduct" (
    "id" TEXT NOT NULL,
    "lender" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "LoanType" NOT NULL,
    "interest" DOUBLE PRECISION NOT NULL,
    "minTenure" INTEGER NOT NULL,
    "maxTenure" INTEGER NOT NULL,

    CONSTRAINT "LoanProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioPosition" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "isin" TEXT NOT NULL,
    "units" DOUBLE PRECISION NOT NULL,
    "avgPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PortfolioPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanApplication" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "tenureMonths" INTEGER NOT NULL,
    "interestRate" DECIMAL(5,2) NOT NULL,
    "purpose" TEXT,
    "status" "LoanStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedAmount" DECIMAL(14,2),
    "emiAmount" DECIMAL(14,2),
    "disbursedAt" TIMESTAMP(3),

    CONSTRAINT "LoanApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanStatusHistory" (
    "id" TEXT NOT NULL,
    "loanApplicationId" TEXT NOT NULL,
    "fromStatus" "LoanStatus",
    "toStatus" "LoanStatus" NOT NULL,
    "comment" TEXT,
    "changedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoanStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "goalType" "GoalType" NOT NULL,
    "targetAmount" DECIMAL(14,2) NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "currentAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "requiredMonthlySip" DECIMAL(14,2),
    "assumedReturnPa" DECIMAL(4,2) NOT NULL,
    "riskProfile" TEXT,
    "status" "GoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalRecommendation" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "schemeId" TEXT,
    "schemeName" TEXT NOT NULL,
    "allocationPercent" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoalRecommendation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoanApplication" ADD CONSTRAINT "LoanApplication_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanStatusHistory" ADD CONSTRAINT "LoanStatusHistory_loanApplicationId_fkey" FOREIGN KEY ("loanApplicationId") REFERENCES "LoanApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalRecommendation" ADD CONSTRAINT "GoalRecommendation_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
