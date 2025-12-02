-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('MF', 'LOAN', 'INSURANCE', 'AIF', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PURCHASE', 'REDEMPTION', 'SIP_INSTALLMENT', 'LOAN_DISBURSAL', 'LOAN_REPAYMENT', 'PREMIUM_PAYMENT', 'WITHDRAWAL');

-- CreateEnum
CREATE TYPE "DistributionChannel" AS ENUM ('ONLINE', 'OFFLINE', 'PARTNER');

-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "productId" TEXT;

-- CreateTable
CREATE TABLE "FinancialProduct" (
    "id" TEXT NOT NULL,
    "type" "ProductType" NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "provider" TEXT,
    "category" TEXT,
    "riskLevel" TEXT,
    "minInvestment" DOUBLE PRECISION,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTransaction" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "portfolioId" TEXT,
    "productId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "units" DOUBLE PRECISION,
    "nav" DOUBLE PRECISION,
    "txnType" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "channel" "DistributionChannel" NOT NULL DEFAULT 'ONLINE',
    "externalRef" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinancialProduct_code_key" ON "FinancialProduct"("code");

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_productId_fkey" FOREIGN KEY ("productId") REFERENCES "FinancialProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTransaction" ADD CONSTRAINT "ProductTransaction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTransaction" ADD CONSTRAINT "ProductTransaction_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTransaction" ADD CONSTRAINT "ProductTransaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "FinancialProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
