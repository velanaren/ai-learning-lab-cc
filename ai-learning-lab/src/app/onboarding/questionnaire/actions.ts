"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";

export async function saveQuestionnaire(answers: Record<string, any>) {
  try {
    // Validate user still exists and is authenticated
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("Authentication required");
    }

    // Check if profile already exists (prevent duplicate creation)
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: currentUser.id },
    });

    if (existingProfile) {
      redirect("/dashboard/today");
      return;
    }

    // Create user profile with all answers
    await prisma.userProfile.create({
      data: {
        userId: currentUser.id,

        // Section 1: Background & Baseline
        role: answers.role || null,
        baselineSkills: answers.baselineSkills || [],
        priorExperience: answers.priorExperience || null,

        // Section 2: Goals & Outcomes
        learningGoals: answers.learningGoals || [],
        desiredOutcomes: answers.desiredOutcomes || [],
        depthPreference: answers.depthPreference || null,

        // Section 3: Learning Structure
        learningFlow: answers.learningFlow || null,
        complexityIncrease: answers.complexityIncrease || null,
        troubleshootingPref: answers.troubleshootingPref || null,

        // Section 4: Platform & Tooling
        operatingSystem: answers.operatingSystem || null,
        installationComfort: answers.installationComfort || null,

        // Section 5: Time & Consistency
        dailyMinutes: answers.dailyMinutes ? parseInt(answers.dailyMinutes) : null,
        weeklyHours: answers.weeklyHours ? parseInt(answers.weeklyHours) : null,
        missedDayBehavior: answers.missedDayBehavior || null,

        // Section 6: Learning Style & Depth
        understandingHelpers: answers.understandingHelpers || [],
        frustrationTrigger: answers.frustrationTrigger || null,
        depthPhilosophy: answers.depthPhilosophy || null,

        // Section 7: Learning Comfort & Accessibility
        preferredFormats: answers.preferredFormats || [],
        audioVideoPreference: answers.audioVideoPreference || null,
        overwhelmTriggers: answers.overwhelmTriggers || [],
        sessionStyle: answers.sessionStyle || null,
        contentOrder: answers.contentOrder || null,
        uiToggles: answers.uiToggles || [],

        // Section 8: Application & Proof-of-Work
        applicationTypes: answers.applicationTypes || [],
        trackingPreference: answers.trackingPreference || null,
        proofOfWorkImportance: answers.proofOfWorkImportance || null,
      },
    });

    redirect("/dashboard/today");
  } catch (error) {
    // Re-throw redirect errors (Next.js uses them for navigation)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Error saving questionnaire:", error);
    throw new Error(
      error instanceof Error
        ? `Failed to save questionnaire: ${error.message}`
        : "Failed to save questionnaire"
    );
  }
}
