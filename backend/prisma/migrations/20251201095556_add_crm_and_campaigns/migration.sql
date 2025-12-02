-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('NOTE', 'CALL', 'MEETING', 'WHATSAPP', 'SMS', 'EMAIL', 'SYSTEM');

-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('WHATSAPP', 'SMS', 'EMAIL');

-- CreateEnum
CREATE TYPE "DirectionType" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENT', 'CANCELLED');

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,
    "advisorId" TEXT,
    "type" "InteractionType" NOT NULL,
    "channel" "ChannelType" NOT NULL,
    "direction" "DirectionType" NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "meta" JSONB,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT,
    "advisorId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueAt" TIMESTAMP(3),
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "channel" "ChannelType" NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "filterJson" JSONB,
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelTemplate" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "channel" "ChannelType" NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,

    CONSTRAINT "ChannelTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CampaignClients" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignClients_AB_unique" ON "_CampaignClients"("A", "B");

-- CreateIndex
CREATE INDEX "_CampaignClients_B_index" ON "_CampaignClients"("B");

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "Advisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "Advisor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignClients" ADD CONSTRAINT "_CampaignClients_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignClients" ADD CONSTRAINT "_CampaignClients_B_fkey" FOREIGN KEY ("B") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
