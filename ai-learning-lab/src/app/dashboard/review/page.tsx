import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Calendar, TrendingUp, Zap, MessageSquare, ChevronRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import {
  weeklyReviewService,
  getWeekDateRange,
} from "@/lib/services/weekly-review-service";
import { ReviewContent } from "./ReviewContent";

export const metadata: Metadata = {
  title: "Weekly Review | AI Learning Lab",
  description: "Review your weekly learning progress",
};

async function WeeklyReviewContent() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  // Get or generate weekly review
  const review = await weeklyReviewService.getOrGenerateReview(user.id);

  if (!review) {
    return <NoActivityState />;
  }

  return <ReviewContent review={review} />;
}

function NoActivityState() {
  return (
    <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 text-center shadow-xl shadow-zinc-200/30 sm:p-12">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
        <BookOpen className="h-8 w-8 text-zinc-400" />
      </div>
      <h3 className="text-xl font-medium text-zinc-900">No activity this week</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
        Complete some learning sessions to see your weekly review. Your progress,
        insights, and personalized suggestions will appear here.
      </p>
      <a
        href="/dashboard/today"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 font-medium text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800"
      >
        Start Today&apos;s Lesson
        <ChevronRight className="h-4 w-4" />
      </a>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Progress Summary Skeleton */}
      <div className="h-40 animate-pulse rounded-3xl bg-zinc-100" />

      {/* Insights Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-32 animate-pulse rounded-2xl bg-zinc-100" />
        <div className="h-32 animate-pulse rounded-2xl bg-zinc-100" />
        <div className="h-32 animate-pulse rounded-2xl bg-zinc-100" />
      </div>

      {/* Progress Bar Skeleton */}
      <div className="h-24 animate-pulse rounded-3xl bg-zinc-100" />

      {/* Adjustment Card Skeleton */}
      <div className="h-48 animate-pulse rounded-3xl bg-zinc-100" />
    </div>
  );
}

export default async function WeeklyReviewPage() {
  const weekDateRange = getWeekDateRange();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

      {/* Content */}
      <div className="relative py-8 sm:py-12">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                {weekDateRange}
              </span>
            </div>
            <h1 className="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
              Weekly Review
            </h1>
            <p className="mt-2 text-base leading-relaxed text-zinc-500">
              Your learning progress, insights, and personalized recommendations
            </p>
          </div>

          {/* Content */}
          <Suspense fallback={<LoadingSkeleton />}>
            <WeeklyReviewContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
