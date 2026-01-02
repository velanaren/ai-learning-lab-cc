"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Layers,
  AlertCircle,
} from "lucide-react";
import { Logo, LogoAnimated } from "@/components/brand";
import { AccessibilityToolbar } from "@/components/accessibility/AccessibilityToolbar";
import { ConceptSection } from "@/components/onboarding/ConceptSection";
import { RegenerateButton } from "@/components/onboarding/RegenerateButton";
import { LockGraphButton } from "@/components/onboarding/LockGraphButton";
import { GenerationProgress } from "@/components/onboarding/GenerationProgress";
import type { ConceptNode } from "@/lib/gemini/prompts";

interface GraphData {
  id: string;
  version: number;
  locked: boolean;
  nodes: ConceptNode[];
  createdAt: string;
}

// Loading fallback component
function GraphLoading() {
  return (
    <div className="landing-page">
      <div className="noise-overlay decorative-bg" data-decorative="true" />
      <div className="hero-gradient" data-decorative="true" style={{ opacity: 0.3 }} />
      <div className="relative flex min-h-screen items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4"
          style={{
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderTopColor: "var(--accent-primary)",
          }}
        />
      </div>
    </div>
  );
}

// Main page component wrapped in Suspense
export default function TopicGraphPage() {
  return (
    <Suspense fallback={<GraphLoading />}>
      <TopicGraphContent />
    </Suspense>
  );
}

function TopicGraphContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTopicId = searchParams.get("topicId");
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [topicId, setTopicId] = useState<string>("");
  const [topicName, setTopicName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchOrGenerateGraph() {
      try {
        // Require topicId in URL for new topic creation flow
        if (!urlTopicId) {
          // Fallback: fetch the most recent topic
          const topicRes = await fetch("/api/onboarding/current-topic", {
            cache: "no-store",
          });
          if (!topicRes.ok) {
            throw new Error("No topic found. Please start from the beginning.");
          }
          const topicData = await topicRes.json();
          // Redirect to the proper URL with topicId
          router.replace(`/onboarding/graph?topicId=${topicData.topic.id}`);
          return;
        }

        // Fetch the specific topic by ID with cache disabled
        const topicRes = await fetch(`/api/onboarding/current-topic?topicId=${urlTopicId}`, {
          cache: "no-store",
        });
        if (!topicRes.ok) {
          throw new Error("Topic not found. Please start from the beginning.");
        }
        const topicData = await topicRes.json();

        // Validate the returned topic matches the requested one
        if (topicData.topic.id !== urlTopicId) {
          console.error("Topic ID mismatch:", { requested: urlTopicId, received: topicData.topic.id });
          throw new Error("Topic mismatch. Please try again.");
        }

        const currentTopicId = topicData.topic.id;
        const currentTopicName = topicData.topic.name;

        setTopicId(currentTopicId);
        setTopicName(currentTopicName);

        // Try to get existing graph with cache disabled
        const graphRes = await fetch(`/api/topics/${currentTopicId}/graph`, {
          cache: "no-store",
        });
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
            `/api/topics/${currentTopicId}/graph`,
            {
              method: "POST",
              cache: "no-store",
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
  }, [urlTopicId, router]);

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

      // Redirect to topic-specific today page
      router.push(`/dashboard/topics/${topicId}/today`);
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
      <div className="landing-page">
        <div className="noise-overlay decorative-bg" data-decorative="true" />
        <div className="hero-gradient" data-decorative="true" style={{ opacity: 0.3 }} />

        <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            <div
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
              <button
                onClick={() => router.push("/onboarding/summary")}
                className="btn-accent w-full"
              >
                go back
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Background effects */}
      <div className="noise-overlay decorative-bg" data-decorative="true" />
      <div className="hero-gradient" data-decorative="true" style={{ opacity: 0.3 }} />

      {/* Header */}
      <header className="relative">
        <div
          className="container mx-auto flex items-center justify-between px-6"
          style={{ height: "var(--space-10)" }}
        >
          <Logo size="md" className="animate-fade-in-up" />
          <div className="animate-fade-in-up animate-delay-1">
            <AccessibilityToolbar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-12)" }}>
        <div className="container mx-auto max-w-4xl px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                backgroundColor: "var(--accent-glow)",
              }}
            >
              <Layers className="h-4 w-4" style={{ color: "var(--accent-primary)" }} />
              <span className="text-sm font-medium lowercase" style={{ color: "var(--accent-primary)" }}>
                your learning path
              </span>
            </div>
            <h1 className="text-section-title">
              {isLoading || isGenerating ? (
                "building your learning path..."
              ) : (
                <>
                  review your <span style={{ color: "var(--accent-primary)" }}>{topicName?.toLowerCase()}</span>{" "}
                  journey
                </>
              )}
            </h1>
            <p className="text-body mx-auto mt-3 max-w-xl">
              {isLoading || isGenerating
                ? "we're analyzing your profile to create the perfect learning sequence."
                : `we've created a ${nodes.length}-concept learning path. review the outline below, then lock it to start learning.`}
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
              <div className="card-dark p-4 text-center">
                <BookOpen className="mx-auto mb-2 h-6 w-6" style={{ color: "var(--accent-primary)" }} />
                <p className="text-2xl font-medium" style={{ color: "var(--text-white)" }}>
                  {nodes.length}
                </p>
                <p className="text-sm lowercase" style={{ color: "var(--text-gray)" }}>concepts</p>
              </div>
              <div className="card-dark p-4 text-center">
                <Clock className="mx-auto mb-2 h-6 w-6" style={{ color: "var(--accent-primary)" }} />
                <p className="text-2xl font-medium" style={{ color: "var(--text-white)" }}>
                  ~{totalHours}
                </p>
                <p className="text-sm lowercase" style={{ color: "var(--text-gray)" }}>hours total</p>
              </div>
              <div className="card-dark p-4 text-center">
                <LogoAnimated className="mx-auto mb-2 h-6 w-6" />
                <p className="text-2xl font-medium" style={{ color: "var(--text-white)" }}>
                  v{graph.version}
                </p>
                <p className="text-sm lowercase" style={{ color: "var(--text-gray)" }}>version</p>
              </div>
            </motion.div>
          )}

          {/* Main Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="card-featured"
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
                      className="h-12 w-12 rounded-full border-4"
                      style={{
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        borderTopColor: "var(--accent-primary)",
                      }}
                    />
                    <p className="text-sm lowercase" style={{ color: "var(--text-gray)" }}>loading...</p>
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
                      <div className="skeleton h-6 w-48 rounded-lg" />
                      <div className="space-y-2">
                        <div className="skeleton h-14 w-full rounded-xl" />
                        <div className="skeleton h-14 w-full rounded-xl" />
                        <div className="skeleton h-14 w-full rounded-xl" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <ConceptSection
                  title="Beginner"
                  nodes={beginnerNodes}
                  allNodes={nodes}
                  startingDayNumber={1}
                />
                <ConceptSection
                  title="Intermediate"
                  nodes={intermediateNodes}
                  allNodes={nodes}
                  startingDayNumber={beginnerNodes.length + 1}
                />
                <ConceptSection
                  title="Advanced"
                  nodes={advancedNodes}
                  allNodes={nodes}
                  startingDayNumber={beginnerNodes.length + intermediateNodes.length + 1}
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
              className="mt-6 text-center text-sm lowercase"
              style={{ color: "var(--text-muted)" }}
            >
              once locked, your learning path cannot be changed. review
              carefully before continuing.
            </motion.p>
          )}
        </div>
      </main>
    </div>
  );
}
