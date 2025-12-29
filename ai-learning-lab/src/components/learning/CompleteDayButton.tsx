"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Loader2, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompleteDayButtonProps {
  conceptId: string;
  reflectionAnswers: string[];
  applicationCompleted: boolean;
  isAlreadyCompleted: boolean;
  isLastDay: boolean;
}

export function CompleteDayButton({
  conceptId,
  reflectionAnswers,
  applicationCompleted,
  isAlreadyCompleted,
  isLastDay,
}: CompleteDayButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(isAlreadyCompleted);
  const [error, setError] = useState<string | null>(null);

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

      setCompleted(true);

      // Show celebration briefly, then navigate
      if (data.isLearningComplete) {
        // Learning journey complete!
        setTimeout(() => {
          router.push("/dashboard/memory");
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextDay = () => {
    router.refresh();
  };

  // Already completed state (viewing past day)
  if (isAlreadyCompleted && !completed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-5 py-2.5">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            Day Completed
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
          className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
        >
          {isLastDay ? (
            <PartyPopper className="h-8 w-8 text-green-600" />
          ) : (
            <CheckCircle className="h-8 w-8 text-green-600" />
          )}
        </motion.div>

        <h3 className="text-xl font-medium text-zinc-900">
          {isLastDay ? "Congratulations!" : "Day Complete!"}
        </h3>
        <p className="mt-2 text-base text-zinc-500">
          {isLastDay
            ? "You've completed your entire learning path!"
            : "Great work! Ready for the next concept?"}
        </p>

        {!isLastDay && (
          <Button
            onClick={handleNextDay}
            className="group mt-6 h-14 rounded-2xl bg-zinc-900 px-8 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25"
          >
            Move to Next Day
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        )}

        {isLastDay && (
          <Button
            onClick={() => router.push("/dashboard/memory")}
            className="group mt-6 h-14 rounded-2xl bg-zinc-900 px-8 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25"
          >
            View Your Learning Journey
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        )}
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
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <Button
        onClick={handleComplete}
        disabled={isLoading}
        className="group h-14 w-full rounded-2xl bg-zinc-900 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Saving...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Complete Day
          </span>
        )}
      </Button>
    </motion.div>
  );
}
