import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/utils";
import { dluService } from "@/lib/services/dlu-service";
import { TimeoutError } from "@/lib/gemini/client";
import { prisma } from "@/lib/db/prisma";

// ========================================
// ERROR MESSAGES
// ========================================

const ERROR_MESSAGES = {
  NOT_AUTHENTICATED: "Please sign in to continue.",
  NO_PLAN: "You haven't started learning yet. Complete the onboarding first.",
  TOPIC_NOT_FOUND: "Topic not found or you don't have access to it.",
  LEARNING_COMPLETE: "Congratulations! You've completed all concepts in this learning path.",
  AI_TIMEOUT: "The AI is taking longer than expected. Please try again.",
  AI_OVERLOADED: "Our AI service is busy. Please wait a moment and try again.",
  GENERATION_FAILED: "We couldn't generate today's lesson. Please try again.",
};

// ========================================
// GET /api/learning/topics/[topicId]/today
// ========================================
// Get today's Daily Learning Unit for a specific topic

export async function GET(
  request: Request,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const { topicId } = await params;
    const user = await getCurrentUser();

    // Verify topic belongs to user
    const topic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        userId: user.id,
      },
    });

    if (!topic) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.TOPIC_NOT_FOUND },
        { status: 404 }
      );
    }

    // Parse query params for specific day request
    const { searchParams } = new URL(request.url);
    const dayParam = searchParams.get("day");
    const requestedDay = dayParam ? parseInt(dayParam, 10) : undefined;

    // Check if learning is complete for this topic
    const isComplete = await dluService.isLearningComplete(user.id, topicId);

    if (isComplete) {
      const status = await dluService.getDayCompletionStatus(user.id, topicId);
      return NextResponse.json({
        isComplete: true,
        topicId,
        topicName: topic.name,
        message: ERROR_MESSAGES.LEARNING_COMPLETE,
        completedDays: status.completedDays,
        totalDays: status.totalDays,
      });
    }

    // Get today's DLU for this topic
    const dlu = await dluService.getTodaysDLU(user.id, requestedDay, topicId);

    return NextResponse.json({
      isComplete: false,
      topicId,
      topicName: topic.name,
      dayIndex: dlu.dayIndex,
      totalDays: dlu.totalDays,
      conceptId: dlu.conceptId,
      conceptName: dlu.conceptName,
      content: dlu.content,
      isCompleted: dlu.isCompleted,
    });
  } catch (error) {
    console.error("Error fetching today's DLU:", error);

    // Handle authentication errors
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_AUTHENTICATED },
        { status: 401 }
      );
    }

    // Handle no plan error
    if (error instanceof Error && error.message.includes("No active learning plan")) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NO_PLAN, needsOnboarding: true },
        { status: 404 }
      );
    }

    // Handle timeout errors
    if (error instanceof TimeoutError) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.AI_TIMEOUT },
        { status: 504 }
      );
    }

    // Handle rate limiting
    const errorWithStatus = error as { status?: number };
    if (errorWithStatus.status === 429) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.AI_OVERLOADED },
        { status: 503 }
      );
    }

    // Handle JSON parse errors (AI returned malformed response)
    if (error instanceof Error && error.message.includes("Failed to parse")) {
      return NextResponse.json(
        { error: "The AI generated an incomplete response. Please refresh to try again." },
        { status: 500 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: ERROR_MESSAGES.GENERATION_FAILED },
      { status: 500 }
    );
  }
}
