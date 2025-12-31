"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Clock,
  CheckCircle,
  PlayCircle,
  Sparkles,
} from "lucide-react";

interface TopicCardProps {
  id: string;
  name: string;
  category: string | null;
  completedDays: number;
  totalDays: number;
  createdAt: Date;
  hasLockedGraph: boolean;
  index: number;
}

export function TopicCard({
  id,
  name,
  category,
  completedDays,
  totalDays,
  createdAt,
  hasLockedGraph,
  index,
}: TopicCardProps) {
  const progress = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
  const isComplete = completedDays >= totalDays && totalDays > 0;
  const isNotStarted = !hasLockedGraph;
  const daysRemaining = totalDays - completedDays;

  // Format created date
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Determine status
  const getStatus = () => {
    if (isNotStarted) return {
      label: "Finish Setup",
      description: "Generate your learning path",
      color: "amber"
    };
    if (isComplete) return {
      label: "Completed",
      description: "Learning path finished",
      color: "green"
    };
    return {
      label: "In Progress",
      description: `Day ${completedDays + 1} of ${totalDays}`,
      color: "blue"
    };
  };

  const status = getStatus();

  // Determine link destination
  const href = isNotStarted
    ? `/onboarding/graph?topicId=${id}`
    : `/dashboard/topics/${id}/today`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
    >
      <Link
        href={href}
        className="group block rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30 transition-all duration-200 hover:border-zinc-300 hover:shadow-2xl hover:shadow-zinc-200/40 sm:p-8"
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                isComplete
                  ? "bg-green-100"
                  : isNotStarted
                    ? "bg-amber-100"
                    : "bg-zinc-900"
              }`}
            >
              {isComplete ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : isNotStarted ? (
                <Sparkles className="h-6 w-6 text-amber-600" />
              ) : (
                <BookOpen className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-zinc-900 transition-colors group-hover:text-zinc-700">
                {name}
              </h3>
              {category && (
                <span className="text-sm capitalize text-zinc-500">
                  {category.replace(/-/g, " ")}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-zinc-400 transition-transform duration-200 group-hover:translate-x-1" />
        </div>

        {/* Status Badge */}
        <div className="mb-4 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              status.color === "green"
                ? "bg-green-100 text-green-700"
                : status.color === "amber"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-blue-100 text-blue-700"
            }`}
          >
            {status.color === "green" ? (
              <CheckCircle className="h-3.5 w-3.5" />
            ) : status.color === "amber" ? (
              <Sparkles className="h-3.5 w-3.5" />
            ) : (
              <PlayCircle className="h-3.5 w-3.5" />
            )}
            {status.label}
          </span>
          <span className="text-xs text-zinc-500">{status.description}</span>
        </div>

        {/* Progress Section */}
        {hasLockedGraph && totalDays > 0 && (
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-zinc-500">Progress</span>
              <span className="font-medium text-zinc-700">
                {completedDays} / {totalDays} days
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className={`h-full rounded-full ${
                  isComplete ? "bg-green-500" : "bg-zinc-900"
                }`}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>Started {formattedDate}</span>
          </div>
          {hasLockedGraph && !isComplete && daysRemaining > 0 && (
            <span className="text-zinc-500">
              {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
