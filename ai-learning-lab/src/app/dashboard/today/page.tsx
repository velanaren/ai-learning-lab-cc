"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Code,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CodeBlock } from "@/components/ui/code-block";
import { DayNavigation } from "@/components/learning/DayNavigation";
import { ReflectionSection } from "@/components/learning/ReflectionSection";
import { ApplicationSection } from "@/components/learning/ApplicationSection";
import { CompleteDayButton } from "@/components/learning/CompleteDayButton";
import type { DLUContent, DLUApplicationMoment } from "@/lib/groq/prompts";

interface DLUData {
  isComplete: boolean;
  dayIndex: number;
  totalDays: number;
  conceptId: string;
  conceptName: string;
  content: DLUContent;
  isCompleted: boolean;
}

export default function TodayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dlu, setDlu] = useState<DLUData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Reflection and application state
  const [reflectionAnswers, setReflectionAnswers] = useState<string[]>([]);
  const [applicationCompleted, setApplicationCompleted] = useState(false);

  const handleAnswersChange = useCallback((answers: string[]) => {
    setReflectionAnswers(answers);
  }, []);

  useEffect(() => {
    async function fetchDLU() {
      setIsLoading(true);
      setError(null);

      try {
        const dayParam = searchParams.get("day");
        const url = dayParam
          ? `/api/learning/today?day=${dayParam}`
          : "/api/learning/today";

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          if (data.needsOnboarding) {
            setNeedsOnboarding(true);
          } else {
            setError(data.error || "Failed to load today's lesson");
          }
          return;
        }

        if (data.isComplete) {
          // Learning journey complete - redirect to memory
          router.push("/dashboard/memory");
          return;
        }

        setDlu(data);
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDLU();
  }, [searchParams, router]);

  // Needs onboarding state
  if (needsOnboarding) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-zinc-200/80 bg-white p-8 text-center shadow-xl shadow-zinc-200/30 sm:p-12"
          >
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
              <Sparkles className="h-8 w-8 text-zinc-600" />
            </div>
            <h2 className="text-2xl font-medium tracking-tight text-zinc-900">
              Start Your Learning Journey
            </h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-500">
              Complete the onboarding process to generate your personalized
              learning path.
            </p>
            <Button
              onClick={() => router.push("/onboarding")}
              className="group mt-8 h-14 rounded-2xl bg-zinc-900 px-8 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25"
            >
              Start Onboarding
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-red-200 bg-white p-8 shadow-xl shadow-red-100/50"
          >
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
              onClick={() => window.location.reload()}
              className="mt-6 h-14 rounded-2xl bg-zinc-900 px-8 text-base font-medium shadow-lg shadow-zinc-900/20"
            >
              Try Again
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Navigation skeleton */}
          <div className="mb-8 h-24 animate-pulse rounded-2xl bg-zinc-100" />

          {/* Title skeleton */}
          <div className="mb-8">
            <div className="mb-4 h-8 w-48 animate-pulse rounded-lg bg-zinc-100" />
            <div className="h-10 w-96 animate-pulse rounded-lg bg-zinc-100" />
          </div>

          {/* Content skeletons */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="mb-6 h-64 animate-pulse rounded-3xl bg-zinc-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!dlu) return null;

  const completedDays = dlu.isCompleted ? dlu.dayIndex : dlu.dayIndex - 1;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Viewing Completed Day Banner */}
        {dlu.isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Eye className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                Reviewing completed lesson
              </p>
              <p className="text-xs text-green-600">
                You completed this day. Your reflections have been saved.
              </p>
            </div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </motion.div>
        )}

        {/* Day Navigation */}
        <DayNavigation
          currentDay={dlu.dayIndex}
          totalDays={dlu.totalDays}
          completedDays={completedDays}
        />

        {/* Concept Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${
              dlu.isCompleted ? "bg-green-100" : "bg-zinc-100"
            }`}>
              {dlu.isCompleted ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <BookOpen className="h-4 w-4 text-zinc-600" />
              )}
              <span className={`text-sm font-medium ${
                dlu.isCompleted ? "text-green-700" : "text-zinc-600"
              }`}>
                {dlu.isCompleted ? "Completed" : "Today's Concept"}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
            {dlu.conceptName}
          </h1>
        </motion.div>

        {/* TL;DR Summary (if present) */}
        {dlu.content.tldrSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Alert className="mb-6 rounded-2xl border-amber-200 bg-amber-50">
              <Lightbulb className="h-5 w-5 text-amber-600" />
              <AlertTitle className="text-amber-800">TL;DR</AlertTitle>
              <AlertDescription className="text-amber-700">
                {dlu.content.tldrSummary}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Concept Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30 sm:p-8"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
              <BookOpen className="h-5 w-5 text-zinc-600" />
            </div>
            <h2 className="text-lg font-medium text-zinc-900">
              Understanding the Concept
            </h2>
          </div>
          <div className="prose prose-zinc max-w-none">
            <p className="whitespace-pre-wrap text-base leading-relaxed text-zinc-600">
              {dlu.content.conceptExplanation}
            </p>
          </div>
        </motion.div>

        {/* Concrete Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30 sm:p-8"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
              <Code className="h-5 w-5 text-zinc-600" />
            </div>
            <h2 className="text-lg font-medium text-zinc-900">Example</h2>
          </div>

          {/* Description */}
          <p className="mb-4 text-base text-zinc-600">
            {dlu.content.concreteExample.description}
          </p>

          {/* Code Block */}
          <div className="mb-6">
            <CodeBlock code={dlu.content.concreteExample.code} />
          </div>

          {/* Step by Step */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-zinc-700">
              Step-by-Step Breakdown
            </h3>
            <ol className="space-y-2">
              {dlu.content.concreteExample.stepByStep.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-zinc-600"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-700">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>

        {/* Reflection Section */}
        <ReflectionSection
          prompts={dlu.content.reflectionPrompts}
          conceptId={dlu.conceptId}
          onAnswersChange={handleAnswersChange}
          disabled={dlu.isCompleted}
        />

        {/* Application Section */}
        {dlu.content.applicationMoment && (
          <ApplicationSection
            task={dlu.content.applicationMoment as DLUApplicationMoment}
            conceptId={dlu.conceptId}
            onCompletedChange={setApplicationCompleted}
            disabled={dlu.isCompleted}
          />
        )}

        {/* Next Steps */}
        {dlu.content.nextSteps && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-6 rounded-2xl bg-zinc-50 p-4 text-center"
          >
            <p className="text-sm text-zinc-500">
              <span className="font-medium text-zinc-700">Coming up next:</span>{" "}
              {dlu.content.nextSteps}
            </p>
          </motion.div>
        )}

        {/* Complete Day Button */}
        <CompleteDayButton
          conceptId={dlu.conceptId}
          reflectionAnswers={reflectionAnswers}
          applicationCompleted={applicationCompleted}
          isAlreadyCompleted={dlu.isCompleted}
          isLastDay={dlu.dayIndex === dlu.totalDays}
        />
      </div>
    </div>
  );
}
