import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();

    const topic = await prisma.topic.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!topic) {
      return NextResponse.json(
        { error: "No topic found" },
        { status: 404 }
      );
    }

    const strategy = await prisma.learningStrategy.findUnique({
      where: {
        userId_topicId: {
          userId: user.id,
          topicId: topic.id,
        },
      },
    });

    if (!strategy) {
      return NextResponse.json(
        { error: "No strategy found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: topic.name,
      strategy: {
        startLevel: strategy.startLevel,
        dailySlicePolicy: strategy.dailySlicePolicy,
        applicationFrequency: strategy.applicationFrequency,
        linkBudgetPolicy: strategy.linkBudgetPolicy,
      },
    });
  } catch (error) {
    console.error("Error fetching graph data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
