import { Brain, History, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memory | AI Learning Lab",
  description: "Your learning memory and evidence",
};

export default function MemoryPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2">
            <History className="h-4 w-4 text-zinc-600" />
            <span className="text-sm font-medium text-zinc-600">
              Learning History
            </span>
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
            Memory
          </h1>
          <p className="mt-2 text-base leading-relaxed text-zinc-500">
            Track your learning progress and evidence
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-200/30 sm:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
              <Brain className="h-8 w-8 text-zinc-600" />
            </div>
            <h2 className="text-xl font-medium text-zinc-900">
              Memory System Coming Soon
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-zinc-500">
              Your learning journal, reflections, and proof-of-work evidence
              will be displayed here. Connect GitHub to track your real progress.
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
