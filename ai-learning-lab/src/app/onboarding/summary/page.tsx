"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="min-h-screen bg-[#FBFBFC] py-12">
        <div className="container mx-auto max-w-3xl px-6">
          <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
            <div className="space-y-4">
              <h2 className="text-2xl font-medium text-zinc-900">
                Something went wrong
              </h2>
              <p className="text-base leading-relaxed text-zinc-600">{error}</p>
              <Button
                onClick={handleEdit}
                className="rounded-full px-9 py-6 text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md"
              >
                Return to Questionnaire
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFC] py-12">
      <div className="container mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-medium leading-[1.2] tracking-tight text-zinc-900 sm:text-4xl">
            Your Learning Contract
          </h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 sm:text-lg">
            {isLoading ? (
              "Generating your personalized learning plan..."
            ) : (
              <>
                Here&apos;s how we&apos;ll design your{" "}
                <span className="font-medium text-zinc-900">{topicName}</span>{" "}
                learning path
              </>
            )}
          </p>
        </div>

        {/* Summary Card */}
        <div className="rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-sm transition-all duration-300">
          {isLoading ? (
            <div className="space-y-6">
              {/* Skeleton for section headers and content */}
              <div className="space-y-3">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-7 w-56" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-7 w-64" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-7 w-52" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ) : (
            <div className="prose prose-zinc max-w-none prose-headings:font-medium prose-headings:text-zinc-900 prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-xl prose-p:text-zinc-600 prose-p:leading-relaxed prose-li:text-zinc-600 prose-strong:text-zinc-900 prose-ul:my-3 first:prose-h2:mt-0">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            onClick={handleConfirm}
            disabled={isLoading || isPending}
            className="rounded-full px-9 py-6 text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? "Please wait..."
              : isPending
                ? "Creating your learning plan..."
                : "Confirm & Continue"}
          </Button>
          <Button
            onClick={handleEdit}
            variant="outline"
            disabled={isLoading || isPending}
            className="rounded-full border-zinc-200 px-9 py-6 text-base font-medium transition-all duration-200 hover:border-zinc-900 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Edit My Answers
          </Button>
        </div>

        {/* Helper Text */}
        <p className="mt-6 text-center text-sm text-zinc-500">
          Review the summary above. If it doesn&apos;t reflect your preferences,
          you can go back and update your answers.
        </p>
      </div>
    </div>
  );
}
