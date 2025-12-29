import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { topicGraphService } from "@/lib/services/topic-graph-service";

// ========================================
// POST /api/topics/[id]/graph/regenerate
// ========================================
// Regenerate Topic Graph with user feedback

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id: topicId } = await params;
    const body = await request.json();
    const { feedback } = body;

    if (!feedback || typeof feedback !== "string" || feedback.trim().length === 0) {
      return NextResponse.json(
        { error: "Feedback is required for regeneration" },
        { status: 400 }
      );
    }

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
    const latestDraft = await prisma.topicGraphVersion.findFirst({
      where: {
        topicId,
        lockedByUser: false,
      },
      orderBy: { version: "desc" },
    });

    if (!latestDraft) {
      return NextResponse.json(
        { error: "No draft graph found to regenerate" },
        { status: 404 }
      );
    }

    // Regenerate with feedback
    const newGraph = await topicGraphService.regenerateGraph(
      latestDraft.id,
      feedback.trim(),
      user.id
    );

    return NextResponse.json(
      {
        graph: {
          id: newGraph.id,
          version: newGraph.version,
          locked: newGraph.lockedByUser,
          nodes: newGraph.nodesJson,
          createdAt: newGraph.createdAt,
        },
        status: "draft",
        previousVersion: latestDraft.version,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error regenerating topic graph:", error);

    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const errorMessage =
      error instanceof Error ? error.message : "Failed to regenerate topic graph";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
