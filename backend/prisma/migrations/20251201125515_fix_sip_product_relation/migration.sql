/*
  Warnings:

  - You are about to drop the column `metadata` on the `ProductTransaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FinancialProduct" ADD COLUMN     "nav" DOUBLE PRECISION,
ADD COLUMN     "navDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ProductTransaction" DROP COLUMN "metadata",
ADD COLUMN     "rawResponse" JSONB;

-- AlterTable
ALTER TABLE "SipPlan" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mandateId" TEXT,
ADD COLUMN     "productId" TEXT;

-- AddForeignKey
ALTER TABLE "SipPlan" ADD CONSTRAINT "SipPlan_productId_fkey" FOREIGN KEY ("productId") REFERENCES "FinancialProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
