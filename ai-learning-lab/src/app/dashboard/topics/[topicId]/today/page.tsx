"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Code,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Eye,
  GraduationCap,
} from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import { DayNavigation } from "@/components/learning/DayNavigation";
import { ReflectionSection } from "@/components/learning/ReflectionSection";
import { ApplicationSection } from "@/components/learning/ApplicationSection";
import { CompleteDayButton } from "@/components/learning/CompleteDayButton";
import { LogoAnimated } from "@/components/brand";
import Link from "next/link";
import type { DLUContent, DLUApplicationMoment } from "@/lib/gemini/prompts";

interface DLUData {
  isComplete: boolean;
  topicId: string;
  topicName: string;
  dayIndex: number;
  totalDays: number;
  conceptId: string;
  conceptName: string;
  content: DLUContent;
  isCompleted: boolean;
}

export default function TopicTodayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const topicId = params.topicId as string;

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
          ? `/api/learning/topics/${topicId}/today?day=${dayParam}`
          : `/api/learning/topics/${topicId}/today`;

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
          router.push(`/dashboard/topics/${topicId}/memory`);
          return;
        }

        setDlu(data);
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    if (topicId) {
      fetchDLU();
    }
  }, [searchParams, router, topicId]);

  // Needs onboarding state
  if (needsOnboarding) {
    return (
      <div className="relative" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-12)" }}>
        <div className="hero-gradient" data-decorative="true" style={{ opacity: 0.1 }} />
        <div className="container mx-auto max-w-2xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-featured text-center"
          >
            <div className="mb-6 flex justify-center">
              <LogoAnimated className="h-20 w-20" />
            </div>
            <h2 className="text-section-title mb-4">
              complete your learning setup
            </h2>
            <p className="text-body mb-8">
              finish setting up this topic to start your learning journey.
            </p>
            <button
              onClick={() => router.push(`/onboarding/graph?topicId=${topicId}`)}
              className="btn-accent"
            >
              continue setup
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-12)" }}>
        <div className="container mx-auto max-w-2xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-dark p-8"
            style={{ borderColor: "rgba(239, 68, 68, 0.3)" }}
          >
            <div
              className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.15)" }}
            >
              <AlertCircle className="h-7 w-7" style={{ color: "#ef4444" }} />
            </div>
            <h2 className="text-section-title mb-2">something went wrong</h2>
            <p className="text-body mb-6">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="btn-accent"
              >
                try again
              </button>
              <Link href="/dashboard" className="btn-outline">
                back to dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="relative" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-12)" }}>
        <div className="container mx-auto max-w-3xl px-6">
          {/* Header skeleton */}
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="skeleton h-12 w-12 rounded-xl" />
              <div className="skeleton h-6 w-24 rounded-full" />
            </div>
            <div className="skeleton h-10 w-64 rounded-lg" />
          </div>

          {/* Navigation skeleton */}
          <div className="skeleton mb-8 h-24 rounded-xl" />

          {/* Content skeletons */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton mb-6 h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!dlu) return null;

  const completedDays = dlu.isCompleted ? dlu.dayIndex : dlu.dayIndex - 1;

  return (
    <div className="relative" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-12)" }}>
      {/* Hero gradient */}
      <div className="hero-gradient" data-decorative="true" style={{ opacity: 0.1 }} />

      <div className="container mx-auto max-w-3xl px-6">
        {/* Back to Dashboard */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm lowercase transition-colors hover:text-[var(--accent-primary)]"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          back to dashboard
        </Link>

        {/* Page Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="mb-4 flex items-center gap-3">
            <div className="icon-box">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-eyebrow">{dlu.topicName.toLowerCase()}</span>
          </div>
          <h1 className="text-section-title">today&apos;s lesson</h1>
          <p className="text-body mt-2">
            focus on one concept at a time. take your time to understand and reflect.
          </p>
        </div>

        {/* Viewing Completed Day Banner */}
        {dlu.isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-3 rounded-xl px-4 py-3"
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
            }}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(34, 197, 94, 0.2)" }}
            >
              <Eye className="h-4 w-4" style={{ color: "#22c55e" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium lowercase" style={{ color: "#22c55e" }}>
                reviewing completed lesson
              </p>
              <p className="text-xs lowercase" style={{ color: "rgba(34, 197, 94, 0.8)" }}>
                you completed this day. your reflections have been saved.
              </p>
            </div>
            <CheckCircle className="h-5 w-5" style={{ color: "#22c55e" }} />
          </motion.div>
        )}

        {/* Day Navigation */}
        <DayNavigation
          currentDay={dlu.dayIndex}
          totalDays={dlu.totalDays}
          completedDays={completedDays}
          topicId={topicId}
        />

        {/* Concept Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mb-3 flex items-center gap-2">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                backgroundColor: dlu.isCompleted
                  ? "rgba(34, 197, 94, 0.15)"
                  : "var(--accent-glow)",
              }}
            >
              {dlu.isCompleted ? (
                <CheckCircle className="h-4 w-4" style={{ color: "#22c55e" }} />
              ) : (
                <BookOpen className="h-4 w-4" style={{ color: "var(--accent-primary)" }} />
              )}
              <span
                className="text-sm font-medium lowercase"
                style={{ color: dlu.isCompleted ? "#22c55e" : "var(--accent-primary)" }}
              >
                {dlu.isCompleted ? "completed" : "today's concept"}
              </span>
            </div>
          </div>
          <h2
            className="text-2xl font-medium lowercase tracking-tight sm:text-3xl"
            style={{ color: "var(--text-white)" }}
          >
            {dlu.conceptName}
          </h2>
        </motion.div>

        {/* Hook - Curiosity Gap */}
        {dlu.content.hook && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 rounded-xl px-4 py-3"
            style={{
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(251, 191, 36, 0.1) 100%)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
            }}
          >
            <div className="flex items-start gap-3">
              <LogoAnimated className="h-8 w-8 flex-shrink-0" />
              <p className="text-sm font-medium" style={{ color: "#fbbf24" }}>
                {dlu.content.hook}
              </p>
            </div>
          </motion.div>
        )}

        {/* Mental Model - The Key Analogy */}
        {dlu.content.mentalModel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="card-dark mb-6"
            style={{
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, var(--bg-card) 100%)",
              borderColor: "rgba(99, 102, 241, 0.2)",
            }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: "rgba(99, 102, 241, 0.15)" }}
              >
                <Lightbulb className="h-5 w-5" style={{ color: "#818cf8" }} />
              </div>
              <h2 className="text-lg font-medium lowercase" style={{ color: "#818cf8" }}>
                the mental model
              </h2>
            </div>
            <p
              className="whitespace-pre-wrap text-base leading-relaxed"
              style={{ color: "var(--text-gray)" }}
            >
              {dlu.content.mentalModel}
            </p>
          </motion.div>
        )}

        {/* Concept Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card-dark mb-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="icon-box">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-medium lowercase" style={{ color: "var(--text-white)" }}>
              let&apos;s dive in
            </h2>
          </div>
          <p
            className="whitespace-pre-wrap text-base leading-relaxed"
            style={{ color: "var(--text-gray)" }}
          >
            {dlu.content.conceptExplanation}
          </p>
        </motion.div>

        {/* Concrete Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="card-dark mb-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="icon-box">
              <Code className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-medium lowercase" style={{ color: "var(--text-white)" }}>
              example
            </h2>
          </div>

          {/* Description */}
          <p className="mb-4 text-base leading-relaxed" style={{ color: "var(--text-gray)" }}>
            {dlu.content.concreteExample.description}
          </p>

          {/* Code Block */}
          <div className="mb-6">
            <CodeBlock code={dlu.content.concreteExample.code} />
          </div>

          {/* Step by Step */}
          <div>
            <h3
              className="mb-3 text-sm font-medium lowercase"
              style={{ color: "var(--text-white)" }}
            >
              step-by-step breakdown
            </h3>
            <ol className="space-y-2">
              {dlu.content.concreteExample.stepByStep.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: "var(--text-gray)" }}
                >
                  <span className="step-number flex-shrink-0">{i + 1}</span>
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

        {/* Synthesis - Tie it Together */}
        {dlu.content.synthesis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mb-6 rounded-xl p-5"
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(34, 197, 94, 0.2)" }}
              >
                <CheckCircle className="h-4 w-4" style={{ color: "#22c55e" }} />
              </div>
              <div>
                <h3
                  className="mb-1 text-sm font-medium lowercase"
                  style={{ color: "#22c55e" }}
                >
                  key takeaway
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(34, 197, 94, 0.9)" }}>
                  {dlu.content.synthesis}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        {dlu.content.nextSteps && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-6 rounded-xl p-4 text-center"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <p className="text-sm lowercase" style={{ color: "var(--text-muted)" }}>
              <span className="font-medium" style={{ color: "var(--text-gray)" }}>
                coming up next:
              </span>{" "}
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
          topicId={topicId}
        />
      </div>
    </div>
  );
}
