import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { QuestionnaireForm } from "@/components/onboarding/QuestionnaireForm";
import {
  getCategoryOptions,
  type TopicCategory,
} from "@/lib/config/topic-categories";

export default async function QuestionnairePage() {
  const user = await getCurrentUser();

  // Check if user already has a profile (already completed questionnaire)
  const existingProfile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });

  if (existingProfile) {
    redirect("/onboarding/summary");
  }

  // Check if user has a topic
  const topic = await prisma.topic.findFirst({
    where: { userId: user.id },
  });

  if (!topic) {
    redirect("/onboarding");
  }

  // Get category-specific options for the questionnaire
  const category = (topic.category as TopicCategory) || "general";
  const categoryOptions = getCategoryOptions(category);

  return (
    <div className="min-h-screen bg-[#FBFBFC] py-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-medium leading-[1.2] tracking-tight text-zinc-900 sm:text-4xl">
            Personalize Your Learning
          </h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 sm:text-lg">
            Answer a few questions to create your tailored{" "}
            <span className="font-medium text-zinc-900">{topic.name}</span>{" "}
            learning path
          </p>
        </div>

        {/* Questionnaire Form */}
        <QuestionnaireForm categoryOptions={categoryOptions} />
      </div>
    </div>
  );
}
