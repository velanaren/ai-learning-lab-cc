import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { topicGraphService } from "@/lib/services/topic-graph-service";
import { TimeoutError } from "@/lib/groq/client";

// ========================================
// ERROR MESSAGES
// ========================================

const ERROR_MESSAGES = {
  NOT_AUTHENTICATED: "Please sign in to continue.",
  TOPIC_NOT_FOUND: "This topic doesn't exist or has been removed.",
  FORBIDDEN: "You don't have permission to access this topic.",
  GRAPH_LOCKED: "This learning path is already locked and cannot be modified.",
  AI_TIMEOUT: "The AI is taking longer than expected to generate your learning path. Please try again.",
  AI_OVERLOADED: "Our AI service is currently busy. Please wait a moment and try again.",
  GENERATION_FAILED: "We couldn't generate your learning path. Please try again.",
  VALIDATION_FAILED: "The generated learning path didn't meet quality standards. Please try again.",
};

// ========================================
// GET /api/topics/[id]/graph
// ========================================
// Retrieve existing draft graph for a topic

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id: topicId } = await params;

    // Get topic and verify ownership
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        graphVersions: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    });

    if (!topic) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.TOPIC_NOT_FOUND },
        { status: 404 }
      );
    }

    if (topic.userId !== user.id) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    // Get the latest graph version (draft or locked)
    const latestGraph = topic.graphVersions[0];

    if (!latestGraph) {
      return NextResponse.json({ graph: null, status: "not_generated" });
    }

    return NextResponse.json({
      graph: {
        id: latestGraph.id,
        version: latestGraph.version,
        locked: latestGraph.lockedByUser,
        nodes: latestGraph.nodesJson,
        createdAt: latestGraph.createdAt,
      },
      status: latestGraph.lockedByUser ? "locked" : "draft",
    });
  } catch (error) {
    console.error("Error fetching topic graph:", error);

    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_AUTHENTICATED },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.GENERATION_FAILED },
      { status: 500 }
    );
  }
}

// ========================================
// POST /api/topics/[id]/graph
// ========================================
// Generate a new draft graph for a topic

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id: topicId } = await params;

    // Check if topic exists and belongs to user
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.TOPIC_NOT_FOUND },
        { status: 404 }
      );
    }

    if (topic.userId !== user.id) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.FORBIDDEN },
        { status: 403 }
      );
    }

    // Check for existing locked graph
    const lockedGraph = await prisma.topicGraphVersion.findFirst({
      where: {
        topicId,
        lockedByUser: true,
      },
    });

    if (lockedGraph) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.GRAPH_LOCKED },
        { status: 400 }
      );
    }

    // Generate draft graph (will return existing draft if one exists)
    const graph = await topicGraphService.generateDraftGraph(topicId, user.id);

    return NextResponse.json(
      {
        graph: {
          id: graph.id,
          version: graph.version,
          locked: graph.lockedByUser,
          nodes: graph.nodesJson,
          createdAt: graph.createdAt,
        },
        status: "draft",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generating topic graph:", error);

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

    // Handle validation errors
    if (error instanceof Error && error.message.includes("Invalid graph")) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.VALIDATION_FAILED },
        { status: 422 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: ERROR_MESSAGES.GENERATION_FAILED },
      { status: 500 }
    );
  }
}
