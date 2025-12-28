import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { classifyTopicWithFallback } from "@/lib/groq/classify-topic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  // Check onboarding completion status
  const existingTopic = await prisma.topic.findFirst({
    where: { userId: user.id },
  });

  const existingProfile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });

  // If user has completed both topic and profile, go to dashboard
  if (existingTopic && existingProfile) {
    redirect("/dashboard/today");
  }

  // If user has a topic but no profile, continue to questionnaire
  if (existingTopic && !existingProfile) {
    redirect("/onboarding/questionnaire");
  }

  // Otherwise, show topic selection page

  async function createTopic(formData: FormData) {
    "use server";

    try {
      const topicName = formData.get("topic") as string;

      // Input validation and sanitization
      if (!topicName || topicName.trim().length < 2) {
        throw new Error("Please enter a valid topic (at least 2 characters)");
      }

      if (topicName.trim().length > 100) {
        throw new Error("Topic name is too long (maximum 100 characters)");
      }

      // Sanitize input - remove potentially dangerous characters
      const sanitizedTopic = topicName.trim().replace(/[<>]/g, "");

      // Validate user still exists
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error("Authentication required");
      }

      // Check if topic already exists
      const existingTopic = await prisma.topic.findFirst({
        where: { userId: currentUser.id },
      });

      if (existingTopic) {
        redirect("/dashboard/today");
        return;
      }

      // Classify the topic to determine questionnaire options
      const classification = await classifyTopicWithFallback(sanitizedTopic);
      console.log(
        `Topic "${sanitizedTopic}" classified as "${classification.category}" with confidence ${classification.confidence}`
      );

      await prisma.topic.create({
        data: {
          userId: currentUser.id,
          name: sanitizedTopic,
          description: `Learning ${sanitizedTopic}`,
          category: classification.category,
        },
      });

      redirect("/onboarding/questionnaire");
    } catch (error) {
      // Re-throw redirect errors (Next.js uses them for navigation)
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
      }

      console.error("Error creating topic:", error);
      throw new Error(
        error instanceof Error
          ? `Failed to create topic: ${error.message}`
          : "Failed to create topic"
      );
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBFBFC] px-4 py-12">
      {/* Skip to main content - Accessibility */}
      <a
        href="#topic-form"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
      >
        Skip to topic selection
      </a>

      <Card className="w-full max-w-2xl rounded-2xl border-zinc-200/60 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
        <CardHeader className="space-y-4 pb-8 text-center">
          <CardTitle className="text-3xl font-medium leading-[1.2] tracking-tight text-zinc-900 sm:text-4xl">
            What do you want to learn?
          </CardTitle>
          <CardDescription className="text-base leading-relaxed text-zinc-600 sm:text-lg">
            Enter any technical topic. The AI will create a personalized
            learning path just for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form id="topic-form" action={createTopic} className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="topic"
                className="text-sm font-medium text-zinc-700"
              >
                Topic
              </Label>
              <Input
                id="topic"
                name="topic"
                placeholder="e.g., Docker, Kubernetes basics, Go programming, PostgreSQL..."
                className="h-12 rounded-xl border-zinc-200 text-base transition-all focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
                required
                autoFocus
              />
              <p className="text-sm leading-relaxed text-zinc-500">
                Examples: "Docker containers", "React hooks", "System design",
                "Git workflows"
              </p>
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full px-9 py-6 text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
            >
              Continue to Questionnaire
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
