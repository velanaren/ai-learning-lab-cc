import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { TopicCard } from "@/components/dashboard/TopicCard";
import { Plus, BookOpen, Target, Zap } from "lucide-react";
import { LogoAnimated } from "@/components/brand";
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
  const firstName = user.name?.split(" ")[0];

  return (
    <div className="relative" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-12)" }}>
      {/* Hero gradient for dashboard */}
      <div className="hero-gradient" data-decorative="true" style={{ opacity: 0.1 }} />

      <div className="container mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="mb-4 flex items-center gap-3">
            <div className="icon-box">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-eyebrow">learning hub</span>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-section-title">
                welcome back{firstName ? `, ${firstName.toLowerCase()}` : ""}
              </h1>
              <p className="text-body mt-2">
                {hasTopics
                  ? "continue your learning journey or start something new."
                  : "start your personalized learning journey today."}
              </p>
            </div>

            {/* Create New Topic Button */}
            {canCreateMore && (
              <Link
                href="/topics/new"
                className="btn-accent animate-fade-in-up animate-delay-1"
              >
                <Plus className="h-5 w-5" />
                new topic
              </Link>
            )}
          </div>
        </div>

        {/* Topics Grid or Empty State */}
        {hasTopics ? (
          <div className="space-y-4">
            <h2 className="text-eyebrow animate-fade-in-up animate-delay-1">
              your learning topics
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
              <div
                className="mt-6 rounded-xl border p-4 text-center animate-fade-in-up"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "rgba(255, 255, 255, 0.06)",
                }}
              >
                <p className="text-body text-sm">
                  you&apos;ve reached the maximum of 2 learning topics.
                  complete or remove a topic to add more.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="card-featured text-center animate-fade-in-up animate-delay-1">
            <div className="mb-6 flex justify-center">
              <LogoAnimated className="h-24 w-24" />
            </div>
            <h2 className="text-section-title mb-4">
              start your learning journey
            </h2>
            <p className="text-body mx-auto max-w-md mb-8">
              choose a topic you want to master. we&apos;ll create a
              personalized learning path tailored to your goals and
              preferences.
            </p>

            {/* Features */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
              <div className="card-dark p-5 text-center">
                <div className="icon-box mx-auto mb-3">
                  <Target className="h-5 w-5" />
                </div>
                <h3
                  className="text-sm font-medium lowercase mb-1"
                  style={{ color: "var(--text-white)" }}
                >
                  personalized path
                </h3>
                <p className="text-muted-sm">
                  ai-generated learning plan based on your goals
                </p>
              </div>
              <div className="card-dark p-5 text-center">
                <div className="icon-box mx-auto mb-3">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3
                  className="text-sm font-medium lowercase mb-1"
                  style={{ color: "var(--text-white)" }}
                >
                  daily learning
                </h3>
                <p className="text-muted-sm">
                  bite-sized lessons that fit your schedule
                </p>
              </div>
              <div className="card-dark p-5 text-center">
                <div className="icon-box mx-auto mb-3">
                  <Zap className="h-5 w-5" />
                </div>
                <h3
                  className="text-sm font-medium lowercase mb-1"
                  style={{ color: "var(--text-white)" }}
                >
                  hands-on practice
                </h3>
                <p className="text-muted-sm">
                  apply what you learn with real exercises
                </p>
              </div>
            </div>

            <Link href="/topics/new" className="btn-primary mt-8 inline-flex">
              <Plus className="h-5 w-5" />
              create your first topic
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
