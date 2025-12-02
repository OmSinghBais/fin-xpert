-- CreateTable
CREATE TABLE "SipPlan" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "dayOfMonth" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SipPlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SipPlan" ADD CONSTRAINT "SipPlan_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
