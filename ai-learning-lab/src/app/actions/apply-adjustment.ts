"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { weeklyReviewService } from "@/lib/services/weekly-review-service";
import type { AdjustmentSuggestion } from "@/lib/gemini/prompts";

export async function applyAdjustment(
  adjustmentType: AdjustmentSuggestion["type"]
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    await weeklyReviewService.applyAdjustment(user.id, adjustmentType);

    return { success: true };
  } catch (error) {
    console.error("Failed to apply adjustment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
