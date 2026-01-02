import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";

// ========================================
// GET /api/onboarding/current-topic
// ========================================
// Get the user's current/latest topic or a specific topic by ID

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    // Check for specific topicId in query params
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get("topicId");

    let topic;

    if (topicId && topicId.trim()) {
      // Fetch specific topic by ID - use findUnique for exact match
      topic = await prisma.topic.findUnique({
        where: {
          id: topicId,
        },
      });

      // Verify the topic belongs to the current user
      if (topic && topic.userId !== user.id) {
        return NextResponse.json(
          { error: "Topic not found or access denied." },
          { status: 404 }
        );
      }
    } else {
      // Fetch the most recent topic for the user
      topic = await prisma.topic.findFirst({
        where: {
          userId: user.id,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!topic) {
      return NextResponse.json(
        { error: "No topic found. Please select a topic first." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      topic: {
        id: topic.id,
        name: topic.name,
        category: topic.category,
        description: topic.description,
      },
    });
  } catch (error) {
    console.error("Error fetching current topic:", error);

    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch current topic" },
      { status: 500 }
    );
  }
}
