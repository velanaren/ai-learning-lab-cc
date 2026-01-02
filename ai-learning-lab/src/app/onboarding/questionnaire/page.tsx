import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { QuestionnaireForm } from "@/components/onboarding/QuestionnaireForm";
import {
  getCategoryOptions,
  type TopicCategory,
} from "@/lib/config/topic-categories";
import { Logo } from "@/components/brand";
import { AccessibilityToolbar } from "@/components/accessibility/AccessibilityToolbar";

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
    <div className="landing-page">
      {/* Background effects */}
      <div className="noise-overlay decorative-bg" data-decorative="true" />
      <div className="hero-gradient" data-decorative="true" style={{ opacity: 0.3 }} />

      {/* Skip to main content - Accessibility */}
      <a
        href="#questionnaire-form"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        style={{
          backgroundColor: "var(--accent-primary)",
          color: "var(--bg-dark)",
        }}
      >
        skip to questionnaire
      </a>

      {/* Header */}
      <header className="relative">
        <div
          className="container mx-auto flex items-center justify-between px-6"
          style={{ height: "var(--space-10)" }}
        >
          <Logo size="md" className="animate-fade-in-up" />
          <div className="animate-fade-in-up animate-delay-1">
            <AccessibilityToolbar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-12)" }}>
        <div className="container mx-auto">
          {/* Page Header */}
          <div className="mb-10 text-center animate-fade-in-up">
            <span className="text-eyebrow">personalize your learning</span>
            <h1 className="text-section-title mt-4">
              let&apos;s customize your{" "}
              <span style={{ color: "var(--accent-primary)" }}>{topic.name.toLowerCase()}</span> journey
            </h1>
            <p className="text-body mx-auto mt-4 max-w-xl">
              answer a few questions to create your tailored learning path.
              this helps us understand how you learn best.
            </p>
          </div>

          {/* Questionnaire Form */}
          <div id="questionnaire-form">
            <QuestionnaireForm categoryOptions={categoryOptions} topicId={topic.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
