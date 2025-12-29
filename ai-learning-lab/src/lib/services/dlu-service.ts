import { prisma } from "@/lib/db/prisma";
import { groq, MODELS, callGroqWithRetry } from "@/lib/groq/client";
import {
  createDLUContentPrompt,
  DLUContent,
  ConceptNode,
} from "@/lib/groq/prompts";

// ========================================
// DLU (DAILY LEARNING UNIT) TYPES
// ========================================

export interface DLU {
  dayIndex: number;
  totalDays: number;
  conceptId: string;
  conceptName: string;
  content: DLUContent;
  isCompleted: boolean;
}

// ========================================
// DLU SERVICE
// ========================================

export class DLUService {
  /**
   * Get today's Daily Learning Unit for a user
   * Returns cached content if available, generates new content if not
   */
  async getTodaysDLU(userId: string, requestedDay?: number): Promise<DLU> {
    // 1. Get user's active DailyPlan
    const plan = await prisma.dailyPlan.findFirst({
      where: { userId },
      orderBy: { generatedAt: "desc" },
    });

    if (!plan) {
      throw new Error("No active learning plan found. Complete onboarding first.");
    }

    // Get the topic graph version separately
    const topicGraphVersion = await prisma.topicGraphVersion.findUnique({
      where: { id: plan.topicGraphVersionId },
      include: { topic: true },
    });

    if (!topicGraphVersion) {
      throw new Error("Topic graph not found. Please regenerate your learning plan.");
    }

    // 2. Determine the current day index
    const totalDays = plan.conceptSequence.length;
    let dayIndex: number;

    if (requestedDay !== undefined) {
      // User requested a specific day
      dayIndex = Math.max(0, Math.min(requestedDay - 1, totalDays - 1));
    } else {
      // Default to next uncompleted day or last completed + 1
      dayIndex = Math.min(plan.completedDays, totalDays - 1);
    }

    const conceptId = plan.conceptSequence[dayIndex];

    if (!conceptId) {
      throw new Error("Invalid day index");
    }

    // 3. Check if this day is completed
    const isCompleted = dayIndex < plan.completedDays;

    // 4. Check for cached DLU content
    const cached = await prisma.dLUCache.findUnique({
      where: {
        conceptId_userId: { conceptId, userId },
      },
    });

    if (cached) {
      // Get concept name from nodesJson
      const nodes = topicGraphVersion.nodesJson as unknown as ConceptNode[];
      const concept = nodes.find((n) => n.id === conceptId);

      return {
        dayIndex: dayIndex + 1, // 1-indexed for display
        totalDays,
        conceptId,
        conceptName: concept?.conceptName || "Unknown Concept",
        content: cached.content as unknown as DLUContent,
        isCompleted,
      };
    }

    // 5. Generate new DLU content
    const content = await this.generateDLUContent(
      conceptId,
      userId,
      topicGraphVersion.nodesJson as unknown as ConceptNode[],
      topicGraphVersion.topic.name,
      plan.conceptSequence,
      dayIndex
    );

    // Get concept name
    const nodes = topicGraphVersion.nodesJson as unknown as ConceptNode[];
    const concept = nodes.find((n) => n.id === conceptId);

    return {
      dayIndex: dayIndex + 1, // 1-indexed for display
      totalDays,
      conceptId,
      conceptName: concept?.conceptName || "Unknown Concept",
      content,
      isCompleted,
    };
  }

  /**
   * Generate DLU content for a specific concept
   */
  async generateDLUContent(
    conceptId: string,
    userId: string,
    allNodes: ConceptNode[],
    topicName: string,
    conceptSequence: string[],
    dayIndex: number
  ): Promise<DLUContent> {
    // 1. Find the concept node
    const conceptNode = allNodes.find((n) => n.id === conceptId);

    if (!conceptNode) {
      throw new Error(`Concept not found: ${conceptId}`);
    }

    // 2. Get user profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error("User profile not found");
    }

    // 3. Get list of prerequisites already covered
    const coveredConceptIds = conceptSequence.slice(0, dayIndex);
    const prerequisitesCovered = coveredConceptIds
      .map((id) => allNodes.find((n) => n.id === id)?.conceptName)
      .filter(Boolean) as string[];

    // 4. Build prompt and call Groq
    const prompt = createDLUContentPrompt(
      conceptNode,
      profile,
      prerequisitesCovered,
      topicName
    );

    const content = await callGroqWithRetry(
      async () => {
        const completion = await groq.chat.completions.create({
          model: MODELS.reasoning,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.4,
          max_tokens: 6000, // Increased for complete JSON responses
        });

        const responseContent = completion.choices[0]?.message?.content || "";
        return this.parseDLUResponse(responseContent);
      },
      {
        timeoutMs: 120000, // 120 seconds for DLU generation (Groq can be slow)
        operationName: "DLU content generation",
        maxRetries: 3, // Increased retries
      }
    );

    // 5. Cache the content
    await prisma.dLUCache.create({
      data: {
        conceptId,
        userId,
        content: content as unknown as object,
      },
    });

    return content;
  }

  /**
   * Parse and validate JSON response from Groq
   */
  private parseDLUResponse(content: string): DLUContent {
    if (!content || content.trim().length === 0) {
      throw new Error("Empty response from Groq");
    }

    let jsonString = content.trim();

    // Try multiple methods to extract JSON

    // Method 1: Remove markdown code blocks
    if (jsonString.startsWith("```json")) {
      jsonString = jsonString.slice(7);
    } else if (jsonString.startsWith("```")) {
      jsonString = jsonString.slice(3);
    }

    if (jsonString.endsWith("```")) {
      jsonString = jsonString.slice(0, -3);
    }

    jsonString = jsonString.trim();

    // Method 2: Try to find JSON object in the response
    if (!jsonString.startsWith("{")) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
    }

    try {
      const data = JSON.parse(jsonString) as DLUContent;

      // Basic structure validation with defaults for optional fields
      if (!data.conceptExplanation) {
        throw new Error("Missing conceptExplanation");
      }

      if (!data.concreteExample) {
        throw new Error("Missing concreteExample");
      }

      // Ensure concreteExample has required fields
      if (!data.concreteExample.description) {
        data.concreteExample.description = "";
      }
      if (!data.concreteExample.code) {
        data.concreteExample.code = "// No code example provided";
      }
      if (!data.concreteExample.stepByStep) {
        data.concreteExample.stepByStep = [];
      }

      if (!data.reflectionPrompts || !Array.isArray(data.reflectionPrompts)) {
        data.reflectionPrompts = ["What did you learn from this concept?"];
      }

      return data;
    } catch (error) {
      // Log first 500 chars of response for debugging
      const preview = content.substring(0, 500);
      console.error("Failed to parse DLU response. Preview:", preview);
      console.error("Response length:", content.length);
      console.error("Parse error:", error instanceof Error ? error.message : error);

      throw new Error(
        `Failed to parse Groq response as JSON: ${error instanceof Error ? error.message : "Unknown error"}. Response length: ${content.length}`
      );
    }
  }

  /**
   * Mark a day as complete and create a MemoryEntry
   */
  async markDayComplete(
    userId: string,
    conceptId: string,
    reflectionText: string,
    applicationCompleted: boolean
  ) {
    // 1. Get the user's plan
    const plan = await prisma.dailyPlan.findFirst({
      where: { userId },
      orderBy: { generatedAt: "desc" },
    });

    if (!plan) {
      throw new Error("No active learning plan found");
    }

    // Get the topic graph version and topic
    const topicGraphVersion = await prisma.topicGraphVersion.findUnique({
      where: { id: plan.topicGraphVersionId },
      include: { topic: true },
    });

    if (!topicGraphVersion) {
      throw new Error("Topic graph not found");
    }

    // 2. Verify the concept is in the sequence
    const dayIndex = plan.conceptSequence.indexOf(conceptId);
    if (dayIndex === -1) {
      throw new Error("Concept not found in learning plan");
    }

    // 3. Create MemoryEntry
    const memoryEntry = await prisma.memoryEntry.create({
      data: {
        userId,
        topicId: topicGraphVersion.topic.id,
        conceptId,
        reflectionText: reflectionText || null,
        actionTaken: applicationCompleted ? "Completed application task" : null,
        tags: [topicGraphVersion.topic.name],
      },
    });

    // 4. Update completedDays in DailyPlan
    // Only increment if this is the next day to complete (prevents skipping)
    if (dayIndex === plan.completedDays) {
      await prisma.dailyPlan.update({
        where: { id: plan.id },
        data: {
          completedDays: plan.completedDays + 1,
        },
      });
    }

    return memoryEntry;
  }

  /**
   * Get completion status for all days
   */
  async getDayCompletionStatus(userId: string): Promise<{
    completedDays: number;
    totalDays: number;
    completedConceptIds: string[];
  }> {
    const plan = await prisma.dailyPlan.findFirst({
      where: { userId },
      orderBy: { generatedAt: "desc" },
    });

    if (!plan) {
      return {
        completedDays: 0,
        totalDays: 0,
        completedConceptIds: [],
      };
    }

    return {
      completedDays: plan.completedDays,
      totalDays: plan.conceptSequence.length,
      completedConceptIds: plan.conceptSequence.slice(0, plan.completedDays),
    };
  }

  /**
   * Check if user has completed all days
   */
  async isLearningComplete(userId: string): Promise<boolean> {
    const status = await this.getDayCompletionStatus(userId);
    return status.totalDays > 0 && status.completedDays >= status.totalDays;
  }
}

// Export singleton instance
export const dluService = new DLUService();
