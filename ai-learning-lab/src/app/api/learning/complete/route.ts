import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/utils";
import { dluService } from "@/lib/services/dlu-service";

// ========================================
// ERROR MESSAGES
// ========================================

const ERROR_MESSAGES = {
  NOT_AUTHENTICATED: "Please sign in to continue.",
  NO_PLAN: "No active learning plan found.",
  INVALID_CONCEPT: "Invalid concept ID provided.",
  COMPLETION_FAILED: "Failed to mark day as complete. Please try again.",
};

// ========================================
// POST /api/learning/complete
// ========================================
// Mark a day as complete and create MemoryEntry

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    const { conceptId, reflectionText, applicationCompleted } = body;

    if (!conceptId || typeof conceptId !== "string") {
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_CONCEPT },
        { status: 400 }
      );
    }

    // Mark day as complete
    const memoryEntry = await dluService.markDayComplete(
      user.id,
      conceptId,
      reflectionText || "",
      applicationCompleted || false
    );

    // Get updated status
    const status = await dluService.getDayCompletionStatus(user.id);
    const isLearningComplete = await dluService.isLearningComplete(user.id);

    return NextResponse.json({
      success: true,
      memoryEntryId: memoryEntry.id,
      completedDays: status.completedDays,
      totalDays: status.totalDays,
      isLearningComplete,
    });
  } catch (error) {
    console.error("Error completing day:", error);

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
        { error: ERROR_MESSAGES.NO_PLAN },
        { status: 404 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: ERROR_MESSAGES.COMPLETION_FAILED },
      { status: 500 }
    );
  }
}
