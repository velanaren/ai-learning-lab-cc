import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { generateContent, TimeoutError } from "@/lib/gemini/client";
import { createLearningContractPrompt } from "@/lib/gemini/prompts";

// ========================================
// ERROR MESSAGES
// ========================================

const ERROR_MESSAGES = {
  NOT_AUTHENTICATED: "Please sign in to continue.",
  PROFILE_NOT_FOUND: "Your profile wasn't found. Please complete the questionnaire first.",
  TOPIC_NOT_FOUND: "No topic selected. Please choose a topic to learn.",
  AI_TIMEOUT: "The AI is taking longer than expected. Please try again in a moment.",
  AI_OVERLOADED: "Our AI service is currently busy. Please wait a moment and try again.",
  GENERATION_FAILED: "We couldn't generate your learning summary. Please try again.",
  UNKNOWN_ERROR: "Something unexpected happened. Please try again.",
};

export async function POST() {
  try {
    const user = await getCurrentUser();

    // Get user's profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.PROFILE_NOT_FOUND },
        { status: 404 }
      );
    }

    // Get user's topic
    const topic = await prisma.topic.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!topic) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.TOPIC_NOT_FOUND },
        { status: 404 }
      );
    }

    // Generate learning contract using Gemini
    const prompt = createLearningContractPrompt(profile, topic.name);

    const summary = await generateContent({
      prompt,
      temperature: 0.7,
      timeoutMs: 60000, // 60 seconds for summary generation
      operationName: "Learning Contract summary generation",
      maxRetries: 2,
    });

    return NextResponse.json({ summary, topic: topic.name });
  } catch (error: unknown) {
    console.error("Error generating summary:", error);

    // Handle authentication errors
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_AUTHENTICATED },
        { status: 401 }
      );
    }

    // Handle timeout errors
    if (error instanceof TimeoutError) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.AI_TIMEOUT },
        { status: 504 }
      );
    }

    // Handle rate limiting / overload
    const errorWithStatus = error as { status?: number };
    if (errorWithStatus.status === 429) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.AI_OVERLOADED },
        { status: 503 }
      );
    }

    // Handle other errors with user-friendly message
    return NextResponse.json(
      { error: ERROR_MESSAGES.GENERATION_FAILED },
      { status: 500 }
    );
  }
}
