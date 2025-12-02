-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "passwordHash" TEXT;

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("name")
);
