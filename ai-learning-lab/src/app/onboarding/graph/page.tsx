"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Layers,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConceptSection } from "@/components/onboarding/ConceptSection";
import { RegenerateButton } from "@/components/onboarding/RegenerateButton";
import { LockGraphButton } from "@/components/onboarding/LockGraphButton";
import { GenerationProgress } from "@/components/onboarding/GenerationProgress";
import type { ConceptNode } from "@/lib/groq/prompts";

interface GraphData {
  id: string;
  version: number;
  locked: boolean;
  nodes: ConceptNode[];
  createdAt: string;
}

export default function TopicGraphPage() {
  const router = useRouter();
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [topicId, setTopicId] = useState<string>("");
  const [topicName, setTopicName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchOrGenerateGraph() {
      try {
        // First, get the user's current topic
        const topicRes = await fetch("/api/onboarding/current-topic");
        if (!topicRes.ok) {
          throw new Error("No topic found. Please start from the beginning.");
        }
        const topicData = await topicRes.json();
        setTopicId(topicData.topic.id);
        setTopicName(topicData.topic.name);

        // Try to get existing graph
        const graphRes = await fetch(`/api/topics/${topicData.topic.id}/graph`);
        if (!graphRes.ok) {
          throw new Error("Failed to fetch graph");
        }

        const graphData = await graphRes.json();

        if (graphData.graph) {
          setGraph(graphData.graph);
          setIsLoading(false);
        } else {
          // No graph exists, generate one
          setIsGenerating(true);
          setIsLoading(false);

          const generateRes = await fetch(
            `/api/topics/${topicData.topic.id}/graph`,
            {
              method: "POST",
            }
          );

          if (!generateRes.ok) {
            const errorData = await generateRes.json();
            throw new Error(errorData.error || "Failed to generate graph");
          }

          const newGraphData = await generateRes.json();
          setGraph(newGraphData.graph);
          setIsGenerating(false);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        setIsLoading(false);
        setIsGenerating(false);
      }
    }

    fetchOrGenerateGraph();
  }, []);

  const handleRegenerate = async (feedback: string) => {
    if (!topicId) return;

    setIsGenerating(true);
    try {
      const res = await fetch(`/api/topics/${topicId}/graph/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to regenerate graph");
      }

      const newGraphData = await res.json();
      setGraph(newGraphData.graph);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Regeneration failed";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLock = async () => {
    if (!topicId) return;

    try {
      const res = await fetch(`/api/topics/${topicId}/graph/lock`, {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to lock graph");
      }

      // Redirect to dashboard
      router.push("/dashboard/today");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Lock failed";
      setError(errorMessage);
    }
  };

  // Parse nodes by difficulty
  const nodes = graph?.nodes || [];
  const beginnerNodes = nodes.filter((n) => n.difficulty === "beginner");
  const intermediateNodes = nodes.filter((n) => n.difficulty === "intermediate");
  const advancedNodes = nodes.filter((n) => n.difficulty === "advanced");

  // Calculate totals
  const totalMinutes = nodes.reduce((acc, n) => acc + (n.estimatedMinutes || 10), 0);
  const totalHours = Math.ceil(totalMinutes / 60);

  // Error state
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
                onClick={() => router.push("/onboarding/summary")}
                className="mt-6 h-14 w-full rounded-2xl bg-zinc-900 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25"
              >
                Go Back
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
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center sm:mb-10"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2">
              <Layers className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                Your Learning Path
              </span>
            </div>
            <h1 className="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
              {isLoading || isGenerating ? (
                "Building your learning path..."
              ) : (
                <>
                  Review Your <span className="text-zinc-600">{topicName}</span>{" "}
                  Journey
                </>
              )}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-zinc-500">
              {isLoading || isGenerating
                ? "We're analyzing your profile to create the perfect learning sequence."
                : `We've created a ${nodes.length}-concept learning path. Review the outline below, then lock it to start learning.`}
            </p>
          </motion.div>

          {/* Stats Cards */}
          {!isLoading && !isGenerating && graph && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 grid grid-cols-3 gap-4"
            >
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 text-center shadow-lg shadow-zinc-200/30">
                <BookOpen className="mx-auto mb-2 h-6 w-6 text-zinc-600" />
                <p className="text-2xl font-medium text-zinc-900">
                  {nodes.length}
                </p>
                <p className="text-sm text-zinc-500">Concepts</p>
              </div>
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 text-center shadow-lg shadow-zinc-200/30">
                <Clock className="mx-auto mb-2 h-6 w-6 text-zinc-600" />
                <p className="text-2xl font-medium text-zinc-900">
                  ~{totalHours}
                </p>
                <p className="text-sm text-zinc-500">Hours Total</p>
              </div>
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 text-center shadow-lg shadow-zinc-200/30">
                <Sparkles className="mx-auto mb-2 h-6 w-6 text-zinc-600" />
                <p className="text-2xl font-medium text-zinc-900">
                  v{graph.version}
                </p>
                <p className="text-sm text-zinc-500">Version</p>
              </div>
            </motion.div>
          )}

          {/* Main Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30 sm:p-8"
          >
            {isLoading || isGenerating ? (
              <div className="space-y-6 py-8">
                {/* Loading spinner for initial load */}
                {isLoading && !isGenerating && (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                      }}
                      className="h-12 w-12 rounded-full border-4 border-zinc-200 border-t-zinc-900"
                    />
                    <p className="text-base text-zinc-500">Loading...</p>
                  </div>
                )}

                {/* Progress indicator for generation */}
                {isGenerating && (
                  <GenerationProgress isGenerating={isGenerating} />
                )}

                {/* Skeleton sections */}
                <div className="mt-8 space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-3">
                      <div className="h-6 w-48 animate-pulse rounded-lg bg-zinc-100" />
                      <div className="space-y-2">
                        <div className="h-14 w-full animate-pulse rounded-xl bg-zinc-100" />
                        <div className="h-14 w-full animate-pulse rounded-xl bg-zinc-100" />
                        <div className="h-14 w-full animate-pulse rounded-xl bg-zinc-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <ConceptSection
                  title="Beginner"
                  nodes={beginnerNodes}
                  allNodes={nodes}
                />
                <ConceptSection
                  title="Intermediate"
                  nodes={intermediateNodes}
                  allNodes={nodes}
                />
                <ConceptSection
                  title="Advanced"
                  nodes={advancedNodes}
                  allNodes={nodes}
                />
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          {!isLoading && !isGenerating && graph && !graph.locked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <LockGraphButton onLock={handleLock} disabled={isGenerating} />
              <RegenerateButton
                onRegenerate={handleRegenerate}
                isLoading={isGenerating}
              />
            </motion.div>
          )}

          {/* Helper Text */}
          {!isLoading && !isGenerating && graph && !graph.locked && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 text-center text-sm text-zinc-400"
            >
              Once locked, your learning path cannot be changed. Review
              carefully before continuing.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
