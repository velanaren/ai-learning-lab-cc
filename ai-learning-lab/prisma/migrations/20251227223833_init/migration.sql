-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "AuthAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT,
    "baselineSkills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "priorExperience" TEXT,
    "learningGoals" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "desiredOutcomes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "depthPreference" TEXT,
    "learningFlow" TEXT,
    "complexityIncrease" TEXT,
    "troubleshootingPref" TEXT,
    "operatingSystem" TEXT,
    "installationComfort" TEXT,
    "dailyMinutes" INTEGER,
    "weeklyHours" INTEGER,
    "missedDayBehavior" TEXT,
    "understandingHelpers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "frustrationTrigger" TEXT,
    "depthPhilosophy" TEXT,
    "preferredFormats" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "audioVideoPreference" TEXT,
    "overwhelmTriggers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sessionStyle" TEXT,
    "contentOrder" TEXT,
    "uiToggles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "applicationTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "trackingPreference" TEXT,
    "proofOfWorkImportance" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningStrategy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "startLevel" TEXT NOT NULL,
    "phaseWeighting" JSONB NOT NULL,
    "dailySlicePolicy" TEXT NOT NULL,
    "applicationFrequency" TEXT NOT NULL,
    "contentFormatPolicy" JSONB NOT NULL,
    "linkBudgetPolicy" TEXT NOT NULL,

    CONSTRAINT "LearningStrategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicGraphVersion" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedByUser" BOOLEAN NOT NULL DEFAULT false,
    "nodesJson" JSONB NOT NULL,

    CONSTRAINT "TopicGraphVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concept" (
    "id" TEXT NOT NULL,
    "topicGraphVersionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "prereqIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "difficulty" TEXT NOT NULL,
    "whyItMatters" TEXT NOT NULL,
    "commonConfusions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "exampleTemplate" TEXT NOT NULL,
    "applicationTemplate" TEXT,

    CONSTRAINT "Concept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "topicGraphVersionId" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conceptSequence" TEXT[],
    "completedDays" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoryEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "reflectionText" TEXT,
    "actionTaken" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemoryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceItem" (
    "id" TEXT NOT NULL,
    "memoryEntryId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "urlOrBlobRef" TEXT NOT NULL,
    "label" TEXT,
    "sourceType" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidenceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GitHubConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accessToken" TEXT NOT NULL,
    "scopes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "selectedRepos" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "GitHubConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DLUCache" (
    "id" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DLUCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "AuthAccount_userId_idx" ON "AuthAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthAccount_provider_providerUserId_key" ON "AuthAccount"("provider", "providerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "LearningStrategy_userId_idx" ON "LearningStrategy"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningStrategy_userId_topicId_key" ON "LearningStrategy"("userId", "topicId");

-- CreateIndex
CREATE INDEX "Topic_userId_idx" ON "Topic"("userId");

-- CreateIndex
CREATE INDEX "TopicGraphVersion_topicId_idx" ON "TopicGraphVersion"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "TopicGraphVersion_topicId_version_key" ON "TopicGraphVersion"("topicId", "version");

-- CreateIndex
CREATE INDEX "Concept_topicGraphVersionId_idx" ON "Concept"("topicGraphVersionId");

-- CreateIndex
CREATE INDEX "DailyPlan_userId_idx" ON "DailyPlan"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyPlan_userId_topicId_key" ON "DailyPlan"("userId", "topicId");

-- CreateIndex
CREATE INDEX "MemoryEntry_userId_createdAt_idx" ON "MemoryEntry"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "MemoryEntry_topicId_idx" ON "MemoryEntry"("topicId");

-- CreateIndex
CREATE INDEX "EvidenceItem_memoryEntryId_idx" ON "EvidenceItem"("memoryEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "GitHubConnection_userId_key" ON "GitHubConnection"("userId");

-- CreateIndex
CREATE INDEX "GitHubConnection_userId_idx" ON "GitHubConnection"("userId");

-- CreateIndex
CREATE INDEX "DLUCache_userId_idx" ON "DLUCache"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DLUCache_conceptId_userId_key" ON "DLUCache"("conceptId", "userId");

-- AddForeignKey
ALTER TABLE "AuthAccount" ADD CONSTRAINT "AuthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicGraphVersion" ADD CONSTRAINT "TopicGraphVersion_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Concept" ADD CONSTRAINT "Concept_topicGraphVersionId_fkey" FOREIGN KEY ("topicGraphVersionId") REFERENCES "TopicGraphVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryEntry" ADD CONSTRAINT "MemoryEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryEntry" ADD CONSTRAINT "MemoryEntry_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceItem" ADD CONSTRAINT "EvidenceItem_memoryEntryId_fkey" FOREIGN KEY ("memoryEntryId") REFERENCES "MemoryEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitHubConnection" ADD CONSTRAINT "GitHubConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DLUCache" ADD CONSTRAINT "DLUCache_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

