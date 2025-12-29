import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";

// ========================================
// GET /api/onboarding/current-topic
// ========================================
// Get the user's current/latest topic

export async function GET() {
  try {
    const user = await getCurrentUser();

    // Get user's most recent topic
    const topic = await prisma.topic.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

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
