"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { generateLearningStrategy } from "@/lib/utils/learning-strategy";

export async function confirmAndContinue(topicId?: string) {
  try {
    const user = await getCurrentUser();

    // Get user's profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new Error("Profile not found. Please complete the questionnaire first.");
    }

    // Get user's topic - either specific one or most recent
    const topic = await prisma.topic.findFirst({
      where: {
        userId: user.id,
        ...(topicId && { id: topicId }),
      },
      orderBy: { createdAt: "desc" },
    });

    if (!topic) {
      throw new Error("Topic not found. Please select a topic first.");
    }

    // Generate LearningStrategy from profile
    await generateLearningStrategy(user.id, topic.id, profile);

    // Redirect to graph generation page with topicId
    const graphUrl = topicId
      ? `/onboarding/graph?topicId=${topicId}`
      : `/onboarding/graph?topicId=${topic.id}`;
    redirect(graphUrl);
  } catch (error) {
    // Re-throw redirect errors (Next.js uses them for navigation)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    // Check if it's a Next.js redirect
    const errorWithDigest = error as { digest?: string };
    if (errorWithDigest.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Error confirming learning contract:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to confirm learning contract"
    );
  }
}
