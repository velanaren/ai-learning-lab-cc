"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Loader2, PartyPopper, Home } from "lucide-react";
import { EvidenceCaptureModal } from "@/components/memory/EvidenceCaptureModal";

interface CompleteDayButtonProps {
  conceptId: string;
  reflectionAnswers: string[];
  applicationCompleted: boolean;
  isAlreadyCompleted: boolean;
  isLastDay: boolean;
  topicId?: string;
}

export function CompleteDayButton({
  conceptId,
  reflectionAnswers,
  applicationCompleted,
  isAlreadyCompleted,
  isLastDay,
  topicId,
}: CompleteDayButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(isAlreadyCompleted);
  const [error, setError] = useState<string | null>(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [memoryEntryId, setMemoryEntryId] = useState<string | null>(null);
  const [isLearningComplete, setIsLearningComplete] = useState(false);

  // Build memory URL based on whether we're in topic-specific or legacy view
  const memoryUrl = topicId
    ? `/dashboard/topics/${topicId}/memory`
    : `/dashboard/memory`;

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/learning/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conceptId,
          reflectionText: reflectionAnswers.filter(Boolean).join("\n\n"),
          applicationCompleted,
          topicId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to complete day");
      }

      const data = await response.json();

      // Clear localStorage for this concept
      localStorage.removeItem(`reflection-answers-${conceptId}`);
      localStorage.removeItem(`app-completed-${conceptId}`);

      // Store completion info
      setMemoryEntryId(data.memoryEntryId);
      setIsLearningComplete(data.isLearningComplete);

      // Show evidence capture modal (user can skip)
      setShowEvidenceModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvidenceComplete = () => {
    setCompleted(true);
    setShowEvidenceModal(false);

    // If learning is complete, navigate to memory after brief delay
    if (isLearningComplete) {
      setTimeout(() => {
        router.push(memoryUrl);
      }, 2000);
    }
  };

  const handleNextDay = () => {
    router.refresh();
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  // Already completed state (viewing past day)
  if (isAlreadyCompleted && !completed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 text-center"
      >
        <div
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5"
          style={{
            backgroundColor: "rgba(34, 197, 94, 0.15)",
          }}
        >
          <CheckCircle className="h-5 w-5" style={{ color: "#22c55e" }} />
          <span className="text-sm font-medium lowercase" style={{ color: "#22c55e" }}>
            day completed
          </span>
        </div>
      </motion.div>
    );
  }

  // Just completed state
  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: "rgba(34, 197, 94, 0.15)" }}
        >
          {isLastDay ? (
            <PartyPopper className="h-8 w-8" style={{ color: "#22c55e" }} />
          ) : (
            <CheckCircle className="h-8 w-8" style={{ color: "#22c55e" }} />
          )}
        </motion.div>

        <h3 className="text-xl font-medium lowercase" style={{ color: "var(--text-white)" }}>
          {isLastDay ? "congratulations!" : "day complete!"}
        </h3>
        <p className="mt-2 text-base lowercase" style={{ color: "var(--text-gray)" }}>
          {isLastDay
            ? "you've completed your entire learning path!"
            : "great work! ready for the next concept?"}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {!isLastDay && (
            <>
              <button
                onClick={handleNextDay}
                className="btn-accent group"
              >
                move to next day
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                onClick={handleBackToDashboard}
                className="btn-outline"
              >
                <Home className="h-5 w-5" />
                back to dashboard
              </button>
            </>
          )}

          {isLastDay && (
            <>
              <button
                onClick={() => router.push(memoryUrl)}
                className="btn-accent group"
              >
                view your learning journey
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                onClick={handleBackToDashboard}
                className="btn-outline"
              >
                <Home className="h-5 w-5" />
                back to dashboard
              </button>
            </>
          )}
        </div>
      </motion.div>
    );
  }

  // Default state - show complete button
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-8"
    >
      {error && (
        <div
          className="mb-4 rounded-xl p-4 text-center text-sm lowercase"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            color: "#ef4444",
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={handleComplete}
        disabled={isLoading}
        className="btn-accent w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            saving...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            complete day
          </span>
        )}
      </button>

      {/* Evidence Capture Modal */}
      {memoryEntryId && (
        <EvidenceCaptureModal
          memoryEntryId={memoryEntryId}
          open={showEvidenceModal}
          onOpenChange={setShowEvidenceModal}
          onComplete={handleEvidenceComplete}
        />
      )}
    </motion.div>
  );
}
