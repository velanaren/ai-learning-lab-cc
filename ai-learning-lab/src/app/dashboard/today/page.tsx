import { BookOpen, Clock, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Today's Learning | AI Learning Lab",
  description: "Your personalized daily learning session",
};

export default function TodayPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2">
            <Clock className="h-4 w-4 text-zinc-600" />
            <span className="text-sm font-medium text-zinc-600">
              Daily Learning
            </span>
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
            Today&apos;s Learning
          </h1>
          <p className="mt-2 text-base leading-relaxed text-zinc-500">
            Your personalized daily learning session
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-200/30 sm:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
              <BookOpen className="h-8 w-8 text-zinc-600" />
            </div>
            <h2 className="text-xl font-medium text-zinc-900">
              Daily Learning Units Coming Soon
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-zinc-500">
              We&apos;re building your personalized learning experience. Once your
              topic graph is generated, your daily concepts will appear here.
            </p>
            <div className="mt-8 flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                In Development
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
