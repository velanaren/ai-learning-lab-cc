import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { QuestionnaireForm } from "@/components/onboarding/QuestionnaireForm";
import {
  getCategoryOptions,
  type TopicCategory,
} from "@/lib/config/topic-categories";

interface QuestionnairePageProps {
  searchParams: Promise<{ topicId?: string }>;
}

export default async function QuestionnairePage({
  searchParams,
}: QuestionnairePageProps) {
  const user = await getCurrentUser();
  const { topicId } = await searchParams;

  // Check if user already has a profile (already completed questionnaire)
  const existingProfile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });

  // If profile exists and no specific topicId, redirect to summary
  if (existingProfile && !topicId) {
    redirect("/onboarding/summary");
  }

  // Get the topic - either specific one or most recent
  const topic = await prisma.topic.findFirst({
    where: {
      userId: user.id,
      ...(topicId && { id: topicId }),
    },
    orderBy: { createdAt: "desc" },
  });

  if (!topic) {
    redirect("/onboarding");
  }

  // Get category-specific options for the questionnaire
  const category = (topic.category as TopicCategory) || "general";
  const categoryOptions = getCategoryOptions(category);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

      <div className="relative py-8 sm:py-12">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-8 text-center sm:mb-12">
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Personalize Your Learning
            </p>
            <h1 className="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
              Let&apos;s customize your{" "}
              <span className="text-zinc-600">{topic.name}</span> journey
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-zinc-500">
              Answer a few questions to create your tailored learning path.
              This helps us understand how you learn best.
            </p>
          </div>

          {/* Questionnaire Form */}
          <QuestionnaireForm categoryOptions={categoryOptions} topicId={topic.id} />
        </div>
      </div>
    </div>
  );
}
