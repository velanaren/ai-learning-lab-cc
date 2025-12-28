import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { groq, MODELS, callGroqWithRetry } from "@/lib/groq/client";
import { createLearningContractPrompt } from "@/lib/groq/prompts";

export async function POST() {
  try {
    const user = await getCurrentUser();

    // Get user's profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found. Complete questionnaire first." },
        { status: 404 }
      );
    }

    // Get user's topic
    const topic = await prisma.topic.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Generate learning contract using Groq
    const prompt = createLearningContractPrompt(profile, topic.name);

    const summary = await callGroqWithRetry(async () => {
      const completion = await groq.chat.completions.create({
        model: MODELS.reasoning,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      });

      return completion.choices[0]?.message?.content || "";
    });

    return NextResponse.json({ summary, topic: topic.name });
  } catch (error: unknown) {
    console.error("Error generating summary:", error);

    // Handle authentication errors
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Handle other errors
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate summary";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
