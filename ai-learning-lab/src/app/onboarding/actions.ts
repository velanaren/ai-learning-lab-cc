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

  // Check if topic already exists
  const existingTopic = await prisma.topic.findFirst({
    where: { userId: currentUser.id },
  });

  if (existingTopic) {
    redirect("/dashboard/today");
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
