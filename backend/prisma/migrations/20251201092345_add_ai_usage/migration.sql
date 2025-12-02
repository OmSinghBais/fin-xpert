-- CreateTable
CREATE TABLE "AiUsage" (
    "id" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiUsage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AiUsage" ADD CONSTRAINT "AiUsage_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "Advisor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
