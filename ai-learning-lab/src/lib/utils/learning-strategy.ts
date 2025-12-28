import type { UserProfile } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

interface PhaseWeighting {
  [key: string]: number;
  fundamentals: number;
  application: number;
  advanced: number;
}

interface ContentFormatPolicy {
  [key: string]: boolean;
  video: boolean;
  diagrams: boolean;
  text: boolean;
}

export async function generateLearningStrategy(
  userId: string,
  topicId: string,
  profile: UserProfile
) {
  // Derive strategy from profile answers

  // 1. Determine start level based on prior experience
  let startLevel: "beginner" | "intermediate" | "advanced" = "beginner";
  if (profile.priorExperience === "Used professionally") {
    startLevel = "advanced";
  } else if (
    profile.priorExperience === "Used in CI-CD" ||
    profile.priorExperience === "Built small things"
  ) {
    startLevel = "intermediate";
  }

  // 2. Determine phase weighting based on goals and preferences
  const phaseWeighting: PhaseWeighting = {
    fundamentals: 30,
    application: 40,
    advanced: 30,
  };

  // Adjust based on learning goals
  if (profile.learningGoals.includes("Fundamentals")) {
    phaseWeighting.fundamentals = 45;
    phaseWeighting.application = 35;
    phaseWeighting.advanced = 20;
  }

  // Adjust based on desired outcomes
  if (profile.desiredOutcomes.includes("Build real apps")) {
    phaseWeighting.application = Math.min(phaseWeighting.application + 10, 50);
    phaseWeighting.fundamentals = Math.max(phaseWeighting.fundamentals - 5, 20);
  }

  // Adjust based on depth preference
  if (profile.depthPreference === "devops-grade mastery") {
    phaseWeighting.advanced = Math.min(phaseWeighting.advanced + 10, 40);
    phaseWeighting.fundamentals = Math.max(phaseWeighting.fundamentals - 5, 20);
  }

  // Normalize to ensure total is 100
  const total =
    phaseWeighting.fundamentals +
    phaseWeighting.application +
    phaseWeighting.advanced;
  if (total !== 100) {
    const scale = 100 / total;
    phaseWeighting.fundamentals = Math.round(phaseWeighting.fundamentals * scale);
    phaseWeighting.application = Math.round(phaseWeighting.application * scale);
    phaseWeighting.advanced = 100 - phaseWeighting.fundamentals - phaseWeighting.application;
  }

  // 3. Daily slice policy (always one concept per day for consistency)
  const dailySlicePolicy = "one-concept-strict";

  // 4. Determine application frequency based on tracking preference
  let applicationFrequency: "none" | "optional-frequent" | "required-daily" =
    "optional-frequent";
  if (profile.trackingPreference === "learning only") {
    applicationFrequency = "none";
  } else if (
    profile.trackingPreference === "learning + applications + evidence"
  ) {
    applicationFrequency = "required-daily";
  }

  // 5. Determine content format policy from preferred formats
  const contentFormatPolicy: ContentFormatPolicy = {
    video: false,
    diagrams: false,
    text: true, // Default to text
  };

  // Check preferred formats
  if (profile.preferredFormats.includes("Short clips")) {
    contentFormatPolicy.video = true;
  }
  if (
    profile.preferredFormats.includes("Diagrams") ||
    profile.preferredFormats.includes("Diagrams and mental models")
  ) {
    contentFormatPolicy.diagrams = true;
  }
  if (
    profile.preferredFormats.includes("Text-first") ||
    profile.preferredFormats.includes("No videos")
  ) {
    contentFormatPolicy.text = true;
  }

  // Check audio/video preference
  if (profile.audioVideoPreference === "avoid audio-video") {
    contentFormatPolicy.video = false;
  } else if (
    profile.audioVideoPreference === "short clips only" ||
    profile.audioVideoPreference === "5-10 min occasionally" ||
    profile.audioVideoPreference === "longer videos ok"
  ) {
    contentFormatPolicy.video = true;
  }

  // 6. Determine link budget based on overwhelm triggers
  let linkBudgetPolicy: "minimal" | "moderate" | "comprehensive" = "moderate";
  if (profile.overwhelmTriggers.includes("Too many links")) {
    linkBudgetPolicy = "minimal";
  } else if (
    profile.depthPreference === "devops-grade mastery" &&
    !profile.overwhelmTriggers.includes("Too many links")
  ) {
    linkBudgetPolicy = "comprehensive";
  }

  // Create or update LearningStrategy
  const strategy = await prisma.learningStrategy.upsert({
    where: {
      userId_topicId: {
        userId,
        topicId,
      },
    },
    create: {
      userId,
      topicId,
      startLevel,
      phaseWeighting,
      dailySlicePolicy,
      applicationFrequency,
      contentFormatPolicy,
      linkBudgetPolicy,
    },
    update: {
      startLevel,
      phaseWeighting,
      dailySlicePolicy,
      applicationFrequency,
      contentFormatPolicy,
      linkBudgetPolicy,
    },
  });

  return strategy;
}
