import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { TopicCard } from "@/components/dashboard/TopicCard";
import { Plus, Sparkles, BookOpen, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | AI Learning Lab",
  description: "Your personalized learning hub",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      topics: {
        include: {
          graphVersions: {
            where: { lockedByUser: true },
            orderBy: { version: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Get daily plans for progress info
  const dailyPlans = await prisma.dailyPlan.findMany({
    where: { userId: user.id },
  });

  // Map topic data with progress
  const topicsWithProgress = user.topics.map((topic) => {
    const dailyPlan = dailyPlans.find((dp) => dp.topicId === topic.id);
    const hasLockedGraph = topic.graphVersions.length > 0;

    return {
      id: topic.id,
      name: topic.name,
      category: topic.category,
      createdAt: topic.createdAt,
      hasLockedGraph,
      completedDays: dailyPlan?.completedDays ?? 0,
      totalDays: dailyPlan?.conceptSequence.length ?? 0,
    };
  });

  const hasTopics = topicsWithProgress.length > 0;
  const canCreateMore = topicsWithProgress.length < 2;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

      <div className="relative py-8 sm:py-12">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                Learning Hub
              </span>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
                  Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}
                </h1>
                <p className="mt-2 text-base leading-relaxed text-zinc-500">
                  {hasTopics
                    ? "Continue your learning journey or start something new."
                    : "Start your personalized learning journey today."}
                </p>
              </div>

              {/* Create New Topic Button */}
              {canCreateMore && (
                <Link href="/topics/new">
                  <Button className="group h-12 rounded-2xl bg-zinc-900 px-6 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25">
                    <Plus className="mr-2 h-5 w-5" />
                    New Topic
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Topics Grid or Empty State */}
          {hasTopics ? (
            <div className="space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
                Your Learning Topics
              </h2>
              <div className="grid gap-4 sm:gap-6">
                {topicsWithProgress.map((topic, index) => (
                  <TopicCard
                    key={topic.id}
                    id={topic.id}
                    name={topic.name}
                    category={topic.category}
                    completedDays={topic.completedDays}
                    totalDays={topic.totalDays}
                    createdAt={topic.createdAt}
                    hasLockedGraph={topic.hasLockedGraph}
                    index={index}
                  />
                ))}
              </div>

              {/* Max topics info */}
              {!canCreateMore && (
                <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center">
                  <p className="text-sm text-zinc-500">
                    You&apos;ve reached the maximum of 2 learning topics.
                    Complete or remove a topic to add more.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 text-center shadow-xl shadow-zinc-200/30 sm:p-12">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
                <Sparkles className="h-8 w-8 text-zinc-600" />
              </div>
              <h2 className="text-2xl font-medium tracking-tight text-zinc-900">
                Start Your Learning Journey
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-zinc-500">
                Choose a topic you want to master. We&apos;ll create a
                personalized learning path tailored to your goals and
                preferences.
              </p>

              {/* Features */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
                    <Target className="h-5 w-5 text-zinc-600" />
                  </div>
                  <h3 className="text-sm font-medium text-zinc-900">
                    Personalized Path
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    AI-generated learning plan based on your goals
                  </p>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
                    <BookOpen className="h-5 w-5 text-zinc-600" />
                  </div>
                  <h3 className="text-sm font-medium text-zinc-900">
                    Daily Learning
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Bite-sized lessons that fit your schedule
                  </p>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
                    <Zap className="h-5 w-5 text-zinc-600" />
                  </div>
                  <h3 className="text-sm font-medium text-zinc-900">
                    Hands-on Practice
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Apply what you learn with real exercises
                  </p>
                </div>
              </div>

              <Link href="/topics/new" className="mt-8 inline-block">
                <Button className="group h-14 rounded-2xl bg-zinc-900 px-8 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Topic
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
