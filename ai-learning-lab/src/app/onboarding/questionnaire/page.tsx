import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { QuestionnaireForm } from "@/components/onboarding/QuestionnaireForm";

export default async function QuestionnairePage() {
  const user = await getCurrentUser();

  // Check if user already has a profile (already completed questionnaire)
  const existingProfile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });

  if (existingProfile) {
    redirect("/dashboard/today");
  }

  // Check if user has a topic
  const topic = await prisma.topic.findFirst({
    where: { userId: user.id },
  });

  if (!topic) {
    redirect("/onboarding");
  }

  async function handleComplete(formData: FormData) {
    "use server";

    try {
      const answersString = formData.get("answers") as string;
      if (!answersString) {
        throw new Error("No answers provided");
      }

      const answers = JSON.parse(answersString);

      // Validate user still exists and is authenticated
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error("Authentication required");
      }

      // Check if profile already exists (prevent duplicate creation)
      const existingProfile = await prisma.userProfile.findUnique({
        where: { userId: currentUser.id },
      });

      if (existingProfile) {
        redirect("/dashboard/today");
        return;
      }

      // Create user profile with all answers
      await prisma.userProfile.create({
        data: {
          userId: currentUser.id,

          // Section 1: Background & Baseline
          role: answers.role || null,
          baselineSkills: answers.baselineSkills || [],
          priorExperience: answers.priorExperience || null,

          // Section 2: Goals & Outcomes
          learningGoals: answers.learningGoals || [],
          desiredOutcomes: answers.desiredOutcomes || [],
          depthPreference: answers.depthPreference || null,

          // Section 3: Learning Structure
          learningFlow: answers.learningFlow || null,
          complexityIncrease: answers.complexityIncrease || null,
          troubleshootingPref: answers.troubleshootingPref || null,

          // Section 4: Platform & Tooling
          operatingSystem: answers.operatingSystem || null,
          installationComfort: answers.installationComfort || null,

          // Section 5: Time & Consistency
          dailyMinutes: answers.dailyMinutes ? parseInt(answers.dailyMinutes) : null,
          weeklyHours: answers.weeklyHours ? parseInt(answers.weeklyHours) : null,
          missedDayBehavior: answers.missedDayBehavior || null,

          // Section 6: Learning Style & Depth
          understandingHelpers: answers.understandingHelpers || [],
          frustrationTrigger: answers.frustrationTrigger || null,
          depthPhilosophy: answers.depthPhilosophy || null,

          // Section 7: Learning Comfort & Accessibility
          preferredFormats: answers.preferredFormats || [],
          audioVideoPreference: answers.audioVideoPreference || null,
          overwhelmTriggers: answers.overwhelmTriggers || [],
          sessionStyle: answers.sessionStyle || null,
          contentOrder: answers.contentOrder || null,
          uiToggles: answers.uiToggles || [],

          // Section 8: Application & Proof-of-Work
          applicationTypes: answers.applicationTypes || [],
          trackingPreference: answers.trackingPreference || null,
          proofOfWorkImportance: answers.proofOfWorkImportance || null,
        },
      });

      redirect("/dashboard/today");
    } catch (error) {
      // Re-throw redirect errors (Next.js uses them for navigation)
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
      }

      console.error("Error saving questionnaire:", error);
      // Re-throw to let Next.js error boundary handle it
      throw new Error(
        error instanceof Error
          ? `Failed to save questionnaire: ${error.message}`
          : "Failed to save questionnaire"
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#FBFBFC] py-12">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-medium leading-[1.2] tracking-tight text-zinc-900 sm:text-4xl">
            Personalize Your Learning
          </h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 sm:text-lg">
            Answer a few questions to create your tailored learning path
          </p>
        </div>

        {/* Questionnaire Form */}
        <QuestionnaireForm
          onComplete={async (answers) => {
            const formData = new FormData();
            formData.append("answers", JSON.stringify(answers));
            await handleComplete(formData);
          }}
        />
      </div>
    </div>
  );
}
