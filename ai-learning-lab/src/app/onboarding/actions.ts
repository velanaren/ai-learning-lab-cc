"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { classifyTopicWithFallback } from "@/lib/gemini/classify-topic";

export async function createTopic(topicName: string) {
  // Input validation and sanitization
  if (!topicName || topicName.trim().length < 2) {
    throw new Error("Please enter a valid topic (at least 2 characters)");
  }

  if (topicName.trim().length > 100) {
    throw new Error("Topic name is too long (maximum 100 characters)");
  }

  // Sanitize input - remove potentially dangerous characters
  const sanitizedTopic = topicName.trim().replace(/[<>]/g, "");

  // Validate user still exists
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("Authentication required");
  }

  // Check how many topics user already has (max 2 allowed)
  const existingTopics = await prisma.topic.findMany({
    where: { userId: currentUser.id },
  });

  if (existingTopics.length >= 2) {
    throw new Error("Maximum of 2 learning topics allowed. Please complete or remove an existing topic first.");
  }

  // Classify the topic to determine questionnaire options
  const classification = await classifyTopicWithFallback(sanitizedTopic);
  console.log(
    `Topic "${sanitizedTopic}" classified as "${classification.category}" with confidence ${classification.confidence}`
  );

  await prisma.topic.create({
    data: {
      userId: currentUser.id,
      name: sanitizedTopic,
      description: `Learning ${sanitizedTopic}`,
      category: classification.category,
    },
  });

  redirect("/onboarding/questionnaire");
}
