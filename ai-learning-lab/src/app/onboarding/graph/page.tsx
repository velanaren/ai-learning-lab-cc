import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";

export default async function GraphPage() {
  const user = await getCurrentUser();

  // Check if user has a learning strategy (completed summary step)
  const topic = await prisma.topic.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!topic) {
    redirect("/onboarding");
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
    redirect("/onboarding/summary");
  }

  return (
    <div className="min-h-screen bg-[#FBFBFC] py-12">
      <div className="container mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-medium leading-[1.2] tracking-tight text-zinc-900 sm:text-4xl">
            Learning Plan Created
          </h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 sm:text-lg">
            Your personalized{" "}
            <span className="font-medium text-zinc-900">{topic.name}</span>{" "}
            learning path is ready
          </p>
        </div>

        {/* Strategy Summary Card */}
        <div className="rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-medium text-zinc-900">
            Your Learning Strategy
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-4">
              <span className="text-sm font-medium text-zinc-700">
                Starting Level
              </span>
              <span className="text-sm text-zinc-900 capitalize">
                {strategy.startLevel}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-4">
              <span className="text-sm font-medium text-zinc-700">
                Daily Approach
              </span>
              <span className="text-sm text-zinc-900">
                {strategy.dailySlicePolicy === "one-concept-strict"
                  ? "One concept per day"
                  : strategy.dailySlicePolicy}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-4">
              <span className="text-sm font-medium text-zinc-700">
                Application Frequency
              </span>
              <span className="text-sm text-zinc-900 capitalize">
                {strategy.applicationFrequency.replace(/-/g, " ")}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-4">
              <span className="text-sm font-medium text-zinc-700">
                External Links
              </span>
              <span className="text-sm text-zinc-900 capitalize">
                {strategy.linkBudgetPolicy}
              </span>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="text-sm font-medium text-amber-800">
            Topic Graph Generation Coming Soon
          </p>
          <p className="mt-1 text-sm text-amber-700">
            The next step will generate your personalized concept map and daily
            learning plan.
          </p>
        </div>
      </div>
    </div>
  );
}
