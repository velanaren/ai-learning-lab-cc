"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { classifyTopicWithFallback } from "@/lib/gemini/classify-topic";

const MAX_TOPICS = 2;

export interface CreateTopicResult {
  success: boolean;
  error?: string;
  topicId?: string;
  hasExistingProfile?: boolean;
}

/**
 * Check if user has an existing profile and how many topics they have
 */
export async function checkUserStatus(): Promise<{
  hasProfile: boolean;
  topicCount: number;
  canCreateMore: boolean;
}> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("Authentication required");
  }

  const [profile, topicCount] = await Promise.all([
    prisma.userProfile.findUnique({
      where: { userId: currentUser.id },
    }),
    prisma.topic.count({
      where: { userId: currentUser.id },
    }),
  ]);

  return {
    hasProfile: !!profile,
    topicCount,
    canCreateMore: topicCount < MAX_TOPICS,
  };
}

/**
 * Create a new topic for the user
 * If reusePreferences is true and user has existing profile, skip questionnaire
 */
export async function createNewTopic(
  topicName: string,
  reusePreferences: boolean = false
): Promise<CreateTopicResult> {
  // Input validation and sanitization
  if (!topicName || topicName.trim().length < 2) {
    return {
      success: false,
      error: "Please enter a valid topic (at least 2 characters)",
    };
  }

  if (topicName.trim().length > 100) {
    return {
      success: false,
      error: "Topic name is too long (maximum 100 characters)",
    };
  }

  // Sanitize input - remove potentially dangerous characters
  const sanitizedTopic = topicName.trim().replace(/[<>]/g, "");

  // Validate user still exists
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      success: false,
      error: "Authentication required",
    };
  }

  // Check how many topics user already has (max 2 allowed)
  const existingTopics = await prisma.topic.findMany({
    where: { userId: currentUser.id },
  });

  if (existingTopics.length >= MAX_TOPICS) {
    return {
      success: false,
      error: `Maximum of ${MAX_TOPICS} learning topics allowed. Please complete or remove an existing topic first.`,
    };
  }

  // Check if user has existing profile
  const existingProfile = await prisma.userProfile.findUnique({
    where: { userId: currentUser.id },
  });

  // Classify the topic to determine questionnaire options
  const classification = await classifyTopicWithFallback(sanitizedTopic);
  console.log(
    `Topic "${sanitizedTopic}" classified as "${classification.category}" with confidence ${classification.confidence}`
  );

  // Create the topic
  const topic = await prisma.topic.create({
    data: {
      userId: currentUser.id,
      name: sanitizedTopic,
      description: `Learning ${sanitizedTopic}`,
      category: classification.category,
    },
  });

  // Determine where to redirect based on preferences
  if (reusePreferences && existingProfile) {
    // Skip questionnaire and summary, go directly to graph generation
    redirect(`/onboarding/graph?topicId=${topic.id}`);
  } else if (existingProfile) {
    // User chose to customize preferences
    redirect(`/onboarding/questionnaire?topicId=${topic.id}`);
  } else {
    // First topic, needs full onboarding
    redirect(`/onboarding/questionnaire?topicId=${topic.id}`);
  }
}
