import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";
import { generateJSON } from "@/lib/gemini/client";
import {
  createWeeklyReviewPrompt,
  WeekData,
  WeeklyReviewData,
  AdjustmentSuggestion,
} from "@/lib/gemini/prompts";

// ========================================
// TYPES
// ========================================

interface GeneratedReview {
  progressSummary: string;
  insights: {
    pacing: string;
    application: string;
    engagement: string;
  };
  adjustmentSuggestion: AdjustmentSuggestion;
  nextWeekPreview: string;
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get the Monday of the current week
 */
function getWeekStartDate(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get date range string for display
 */
export function getWeekDateRange(weekStart: Date = getWeekStartDate()): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const startStr = weekStart.toLocaleDateString("en-US", options);
  const endStr = weekEnd.toLocaleDateString("en-US", {
    ...options,
    year: "numeric",
  });

  return `${startStr} - ${endStr}`;
}

/**
 * Detect confusion signals from reflection text
 */
function detectConfusionSignals(reflectionText: string | null): string[] {
  if (!reflectionText) return [];

  const confusionPatterns = [
    { pattern: /confus/i, signal: "confusion mentioned" },
    { pattern: /don't understand/i, signal: "understanding difficulty" },
    { pattern: /not sure/i, signal: "uncertainty" },
    { pattern: /unclear/i, signal: "clarity issues" },
    { pattern: /struggling/i, signal: "struggling" },
    { pattern: /hard to grasp/i, signal: "comprehension difficulty" },
    { pattern: /lost/i, signal: "feeling lost" },
    { pattern: /overwhelm/i, signal: "feeling overwhelmed" },
  ];

  const signals: string[] = [];
  for (const { pattern, signal } of confusionPatterns) {
    if (pattern.test(reflectionText)) {
      signals.push(signal);
    }
  }

  return signals;
}

// ========================================
// WEEKLY REVIEW SERVICE
// ========================================

export class WeeklyReviewService {
  /**
   * Get or generate a weekly review for the user
   */
  async getOrGenerateReview(userId: string): Promise<WeeklyReviewData | null> {
    const weekStart = getWeekStartDate();

    // Check for cached review
    const cachedReview = await prisma.weeklyReview.findUnique({
      where: {
        userId_weekStartDate: {
          userId,
          weekStartDate: weekStart,
        },
      },
    });

    if (cachedReview) {
      return cachedReview.reviewData as unknown as WeeklyReviewData;
    }

    // Generate new review
    return this.generateWeeklyReview(userId);
  }

  /**
   * Generate a new weekly review
   */
  async generateWeeklyReview(userId: string): Promise<WeeklyReviewData | null> {
    // Get week data
    const weekData = await this.getWeekData(userId);

    // If no activity this week, return null
    if (weekData.completedDays === 0) {
      return null;
    }

    // Get user's active topic
    const topic = await prisma.topic.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Get user profile for daily minutes
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    // Generate review using AI
    const prompt = createWeeklyReviewPrompt(
      weekData,
      topic?.name || "your learning journey",
      profile?.dailyMinutes || null
    );

    try {
      const generatedReview = await generateJSON<GeneratedReview>({
        prompt,
        operationName: "Weekly Review Generation",
        temperature: 0.7,
      });

      const reviewData: WeeklyReviewData = {
        ...generatedReview,
        weekData,
      };

      // Cache the review
      const weekStart = getWeekStartDate();
      await prisma.weeklyReview.upsert({
        where: {
          userId_weekStartDate: {
            userId,
            weekStartDate: weekStart,
          },
        },
        update: {
          reviewData: reviewData as unknown as Prisma.InputJsonValue,
          generatedAt: new Date(),
        },
        create: {
          userId,
          weekStartDate: weekStart,
          reviewData: reviewData as unknown as Prisma.InputJsonValue,
        },
      });

      return reviewData;
    } catch (error) {
      console.error("Failed to generate weekly review:", error);
      throw error;
    }
  }

  /**
   * Get learning data for the past week
   */
  async getWeekData(userId: string): Promise<WeekData> {
    const weekStart = getWeekStartDate();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    // Fetch memory entries for this week
    const entries = await prisma.memoryEntry.findMany({
      where: {
        userId,
        createdAt: {
          gte: weekStart,
          lt: weekEnd,
        },
      },
      include: {
        topic: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Calculate metrics
    const completedDays = entries.length;
    const appliedDays = entries.filter((e) => e.actionTaken !== null).length;

    // Get concept names from the topic graph
    const conceptNames: string[] = [];
    const conceptIds = entries.map((e) => e.conceptId);

    if (conceptIds.length > 0 && entries[0]?.topicId) {
      const graph = await prisma.topicGraphVersion.findFirst({
        where: {
          topicId: entries[0].topicId,
          lockedByUser: true,
        },
        orderBy: { version: "desc" },
      });

      if (graph) {
        const nodes = graph.nodesJson as Array<{ id: string; conceptName: string }>;
        for (const conceptId of conceptIds) {
          const node = nodes.find((n) => n.id === conceptId);
          if (node) {
            conceptNames.push(node.conceptName);
          }
        }
      }
    }

    // Calculate average reflection length
    const reflectionLengths = entries
      .map((e) => e.reflectionText?.length || 0)
      .filter((len) => len > 0);
    const averageReflectionLength =
      reflectionLengths.length > 0
        ? Math.round(
            reflectionLengths.reduce((a, b) => a + b, 0) / reflectionLengths.length
          )
        : 0;

    // Detect confusion signals
    const allConfusionSignals: string[] = [];
    for (const entry of entries) {
      const signals = detectConfusionSignals(entry.reflectionText);
      allConfusionSignals.push(...signals);
    }
    // Deduplicate
    const uniqueConfusionSignals = [...new Set(allConfusionSignals)];

    // Calculate skipped days (days where user was expected to learn but didn't)
    const skippedDays: number[] = [];
    const dailyPlan = await prisma.dailyPlan.findFirst({
      where: { userId },
      orderBy: { generatedAt: "desc" },
    });

    if (dailyPlan) {
      const expectedDays = Math.min(7, dailyPlan.conceptSequence.length);
      for (let i = 0; i < expectedDays; i++) {
        const dayHasEntry = entries.some((e) => {
          const entryDayOfWeek = new Date(e.createdAt).getDay();
          const expectedDayOfWeek = (weekStart.getDay() + i) % 7;
          return entryDayOfWeek === expectedDayOfWeek;
        });
        if (!dayHasEntry) {
          skippedDays.push(i + 1); // 1-indexed
        }
      }
    }

    return {
      totalDays: 7,
      completedDays,
      skippedDays,
      appliedDays,
      conceptsCovered: conceptNames,
      averageReflectionLength,
      confusionSignals: uniqueConfusionSignals,
    };
  }

  /**
   * Apply an adjustment to the user's learning strategy
   */
  async applyAdjustment(
    userId: string,
    adjustmentType: AdjustmentSuggestion["type"]
  ): Promise<void> {
    // Get user's current topic
    const topic = await prisma.topic.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!topic) return;

    // Get or create learning strategy
    let strategy = await prisma.learningStrategy.findUnique({
      where: {
        userId_topicId: {
          userId,
          topicId: topic.id,
        },
      },
    });

    if (!strategy) {
      // Create default strategy
      strategy = await prisma.learningStrategy.create({
        data: {
          userId,
          topicId: topic.id,
          startLevel: "beginner",
          phaseWeighting: { fundamentals: 40, application: 40, advanced: 20 },
          dailySlicePolicy: "one-concept-strict",
          applicationFrequency: "optional-frequent",
          contentFormatPolicy: { video: true, diagrams: true, text: true },
          linkBudgetPolicy: "moderate",
        },
      });
    }

    // Apply adjustment based on type
    switch (adjustmentType) {
      case "pace_down":
        await prisma.learningStrategy.update({
          where: { id: strategy.id },
          data: {
            dailySlicePolicy: "one-concept-relaxed",
            phaseWeighting: { fundamentals: 50, application: 35, advanced: 15 },
          },
        });
        // Also reduce user's daily minutes if profile exists
        const profile = await prisma.userProfile.findUnique({
          where: { userId },
        });
        if (profile) {
          await prisma.userProfile.update({
            where: { userId },
            data: {
              dailyMinutes: Math.max(10, (profile.dailyMinutes || 20) - 5),
            },
          });
        }
        break;

      case "pace_up":
        await prisma.learningStrategy.update({
          where: { id: strategy.id },
          data: {
            dailySlicePolicy: "one-concept-strict",
            phaseWeighting: { fundamentals: 30, application: 45, advanced: 25 },
          },
        });
        break;

      case "more_application":
        await prisma.learningStrategy.update({
          where: { id: strategy.id },
          data: {
            applicationFrequency: "required-daily",
            phaseWeighting: { fundamentals: 35, application: 50, advanced: 15 },
          },
        });
        break;

      case "smaller_chunks":
        await prisma.learningStrategy.update({
          where: { id: strategy.id },
          data: {
            dailySlicePolicy: "micro-concepts",
            contentFormatPolicy: { video: false, diagrams: true, text: true },
          },
        });
        break;

      case "none":
        // No changes needed
        break;
    }

    // Mark the current week's review as having adjustment applied
    const weekStart = getWeekStartDate();
    await prisma.weeklyReview.updateMany({
      where: {
        userId,
        weekStartDate: weekStart,
      },
      data: {
        reviewData: {
          // This will be handled in the page component by refetching
        },
      },
    });
  }
}

// Export singleton instance
export const weeklyReviewService = new WeeklyReviewService();
