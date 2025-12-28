"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Check, Pencil, Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmAndContinue } from "./actions";

export default function SummaryPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<string>("");
  const [topicName, setTopicName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch("/api/onboarding/summary", {
          method: "POST",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to generate summary");
        }

        const data = await response.json();
        setSummary(data.summary);
        setTopicName(data.topic);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSummary();
  }, []);

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await confirmAndContinue();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to confirm";
        setError(errorMessage);
      }
    });
  };

  const handleEdit = () => {
    router.push("/onboarding/questionnaire");
  };

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

        <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-xl shadow-red-100/50">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
                <AlertCircle className="h-7 w-7 text-red-600" />
              </div>
              <h2 className="text-2xl font-medium tracking-tight text-zinc-900">
                Something went wrong
              </h2>
              <p className="mt-3 text-base leading-relaxed text-zinc-500">
                {error}
              </p>
              <Button
                onClick={handleEdit}
                className="mt-6 h-14 w-full rounded-2xl bg-zinc-900 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25"
              >
                Return to Questionnaire
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

      <div className="relative py-8 sm:py-12">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center sm:mb-10"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                Your Learning Contract
              </span>
            </div>
            <h1 className="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
              {isLoading ? (
                "Creating your personalized plan..."
              ) : (
                <>
                  Your <span className="text-zinc-600">{topicName}</span>{" "}
                  learning path
                </>
              )}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-zinc-500">
              {isLoading
                ? "We're analyzing your preferences to design the perfect learning experience."
                : "Review the summary below. This is how we'll tailor your learning experience."}
            </p>
          </motion.div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30 sm:p-8"
          >
            {isLoading ? (
              <div className="space-y-8">
                {/* Skeleton loading state */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-3">
                    <div className="h-6 w-48 animate-pulse rounded-lg bg-zinc-100" />
                    <div className="space-y-2">
                      <div className="h-4 w-full animate-pulse rounded-lg bg-zinc-100" />
                      <div
                        className="h-4 animate-pulse rounded-lg bg-zinc-100"
                        style={{ width: `${85 - i * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="prose prose-zinc max-w-none prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-zinc-900 prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-xl prose-p:leading-relaxed prose-p:text-zinc-600 prose-li:text-zinc-600 prose-strong:text-zinc-900 prose-ul:my-3 first:prose-h2:mt-0">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <Button
              onClick={handleConfirm}
              disabled={isLoading || isPending}
              className="group h-14 rounded-2xl bg-zinc-900 px-8 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1 sm:max-w-xs"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                  />
                  Please wait...
                </span>
              ) : isPending ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                  />
                  Creating your plan...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Confirm & Continue
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              )}
            </Button>
            <Button
              onClick={handleEdit}
              variant="outline"
              disabled={isLoading || isPending}
              className="h-14 rounded-2xl border-2 border-zinc-200 px-8 text-base font-medium transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1 sm:max-w-xs"
            >
              <Pencil className="mr-2 h-5 w-5" />
              Edit My Answers
            </Button>
          </motion.div>

          {/* Helper Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-center text-sm text-zinc-400"
          >
            Review the summary above. If it doesn&apos;t reflect your
            preferences, you can go back and update your answers.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
