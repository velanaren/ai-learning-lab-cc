import { prisma } from "@/lib/db/prisma";
import { generateJSON } from "@/lib/gemini/client";
import {
  createDLUContentPrompt,
  DLUContent,
  ConceptNode,
} from "@/lib/gemini/prompts";

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

    // 4. Build prompt and call Gemini
    const prompt = createDLUContentPrompt(
      conceptNode,
      profile,
      prerequisitesCovered,
      topicName,
      dayIndex
    );

    const rawContent = await generateJSON<Record<string, unknown>>({
      prompt,
      temperature: 0.6,
      timeoutMs: 120000, // 120 seconds for DLU generation
      operationName: "DLU content generation",
      maxRetries: 3,
    });

    // Normalize the response to match expected DLUContent structure
    const content = this.normalizeDLUContent(rawContent);

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
   * Normalize the DLU response to ensure all required fields exist
   */
  private normalizeDLUContent(raw: Record<string, unknown>): DLUContent {
    // Handle the new structure with hook, mentalModel, synthesis
    const content: DLUContent = {
      hook: (raw.hook as string) || "",
      mentalModel: (raw.mentalModel as string) || "",
      conceptExplanation: (raw.conceptExplanation as string) || "",
      concreteExample: {
        description: "",
        code: "// No code example provided",
        stepByStep: [],
      },
      reflectionPrompts: [],
      applicationMoment: null,
      synthesis: (raw.synthesis as string) || "",
      nextSteps: (raw.nextSteps as string) || "",
    };

    // Handle concreteExample
    if (raw.concreteExample && typeof raw.concreteExample === "object") {
      const example = raw.concreteExample as Record<string, unknown>;
      content.concreteExample = {
        description: (example.description as string) || "",
        code: (example.code as string) || "// No code example provided",
        stepByStep: Array.isArray(example.stepByStep)
          ? (example.stepByStep as string[])
          : [],
      };
    }

    // Handle reflectionPrompts
    if (Array.isArray(raw.reflectionPrompts)) {
      content.reflectionPrompts = raw.reflectionPrompts as string[];
    } else {
      content.reflectionPrompts = ["What did you learn from this concept?"];
    }

    // Handle applicationMoment
    if (raw.applicationMoment && typeof raw.applicationMoment === "object") {
      const app = raw.applicationMoment as Record<string, unknown>;
      content.applicationMoment = {
        task: (app.task as string) || "",
        guidance: (app.guidance as string) || "",
        expectedOutput: (app.expectedOutput as string) || "",
      };
    }

    // Validation
    if (!content.conceptExplanation && !content.mentalModel) {
      throw new Error("Missing both conceptExplanation and mentalModel");
    }

    return content;
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
