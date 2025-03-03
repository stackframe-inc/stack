-- CreateTable
CREATE TABLE "CliAuthToken" (
    "id" TEXT NOT NULL,
    "pollingToken" TEXT NOT NULL,
    "internalToken" TEXT,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "tenancyId" TEXT,
    "projectUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CliAuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CliAuthToken_pollingToken_key" ON "CliAuthToken"("pollingToken");
