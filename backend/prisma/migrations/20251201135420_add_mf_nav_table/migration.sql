-- CreateTable
CREATE TABLE "MutualFundNav" (
    "id" TEXT NOT NULL,
    "schemeCode" TEXT NOT NULL,
    "isin" TEXT,
    "schemeName" TEXT NOT NULL,
    "nav" DOUBLE PRECISION NOT NULL,
    "navDate" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'AMFI',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT,

    CONSTRAINT "MutualFundNav_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MutualFundNav_schemeCode_idx" ON "MutualFundNav"("schemeCode");

-- CreateIndex
CREATE INDEX "MutualFundNav_navDate_idx" ON "MutualFundNav"("navDate");

-- AddForeignKey
ALTER TABLE "MutualFundNav" ADD CONSTRAINT "MutualFundNav_productId_fkey" FOREIGN KEY ("productId") REFERENCES "FinancialProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
