import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { topicGraphService } from "@/lib/services/topic-graph-service";
import { ConceptNode } from "@/lib/gemini/prompts";

// ========================================
// POST /api/topics/[id]/graph/lock
// ========================================
// Lock a draft Topic Graph and generate initial DailyPlan

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id: topicId } = await params;

    // Get topic and verify ownership
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    if (topic.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get the latest unlocked graph version
    const draftGraph = await prisma.topicGraphVersion.findFirst({
      where: {
        topicId,
        lockedByUser: false,
      },
      orderBy: { version: "desc" },
    });

    if (!draftGraph) {
      return NextResponse.json(
        { error: "No draft graph found to lock" },
        { status: 404 }
      );
    }

    // Lock the graph using the service (includes validation)
    const lockedGraph = await topicGraphService.lockGraph(draftGraph.id, user.id);

    // Generate the initial DailyPlan
    const nodes = lockedGraph.nodesJson as unknown as ConceptNode[];
    const sortedNodes = topicGraphService.topologicalSort(nodes);

    // Create or update DailyPlan
    const dailyPlan = await prisma.dailyPlan.upsert({
      where: {
        userId_topicId: {
          userId: user.id,
          topicId,
        },
      },
      create: {
        userId: user.id,
        topicId,
        topicGraphVersionId: lockedGraph.id,
        conceptSequence: sortedNodes.map((n) => n.id),
        completedDays: 0,
      },
      update: {
        topicGraphVersionId: lockedGraph.id,
        conceptSequence: sortedNodes.map((n) => n.id),
        completedDays: 0,
      },
    });

    return NextResponse.json({
      success: true,
      graph: {
        id: lockedGraph.id,
        version: lockedGraph.version,
        locked: true,
      },
      plan: {
        id: dailyPlan.id,
        totalConcepts: sortedNodes.length,
        conceptSequence: dailyPlan.conceptSequence,
      },
    });
  } catch (error) {
    console.error("Error locking topic graph:", error);

    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const errorMessage =
      error instanceof Error ? error.message : "Failed to lock topic graph";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
