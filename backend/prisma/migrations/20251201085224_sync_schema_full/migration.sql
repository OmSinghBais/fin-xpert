-- CreateTable
CREATE TABLE "PortfolioHolding" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "lastPrice" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioHolding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditScoreCheck" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "bureau" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditScoreCheck_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PortfolioHolding" ADD CONSTRAINT "PortfolioHolding_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditScoreCheck" ADD CONSTRAINT "CreditScoreCheck_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
