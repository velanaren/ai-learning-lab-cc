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
      label: "finish setup",
      description: "generate your learning path",
      color: "amber"
    };
    if (isComplete) return {
      label: "completed",
      description: "learning path finished",
      color: "green"
    };
    return {
      label: "in progress",
      description: `day ${completedDays + 1} of ${totalDays}`,
      color: "accent"
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
        className="card-dark group block transition-all duration-300"
        style={{ padding: "var(--space-6)" }}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{
                backgroundColor: isComplete
                  ? "rgba(34, 197, 94, 0.15)"
                  : isNotStarted
                    ? "rgba(245, 158, 11, 0.15)"
                    : "var(--accent-glow)",
              }}
            >
              {isComplete ? (
                <CheckCircle className="h-6 w-6" style={{ color: "#22c55e" }} />
              ) : isNotStarted ? (
                <Sparkles className="h-6 w-6" style={{ color: "#f59e0b" }} />
              ) : (
                <BookOpen className="h-6 w-6" style={{ color: "var(--accent-primary)" }} />
              )}
            </div>
            <div>
              <h3
                className="text-lg font-medium lowercase transition-colors group-hover:text-[var(--accent-primary)]"
                style={{ color: "var(--text-white)" }}
              >
                {name}
              </h3>
              {category && (
                <span
                  className="text-sm lowercase"
                  style={{ color: "var(--text-gray)" }}
                >
                  {category.replace(/-/g, " ")}
                </span>
              )}
            </div>
          </div>
          <ChevronRight
            className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
            style={{ color: "var(--text-muted)" }}
          />
        </div>

        {/* Status Badge */}
        <div className="mb-4 flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium lowercase"
            style={{
              backgroundColor:
                status.color === "green"
                  ? "rgba(34, 197, 94, 0.15)"
                  : status.color === "amber"
                    ? "rgba(245, 158, 11, 0.15)"
                    : "var(--accent-glow)",
              color:
                status.color === "green"
                  ? "#22c55e"
                  : status.color === "amber"
                    ? "#f59e0b"
                    : "var(--accent-primary)",
            }}
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
          <span className="text-xs lowercase" style={{ color: "var(--text-muted)" }}>
            {status.description}
          </span>
        </div>

        {/* Progress Section */}
        {hasLockedGraph && totalDays > 0 && (
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between text-sm lowercase">
              <span style={{ color: "var(--text-gray)" }}>progress</span>
              <span className="font-medium" style={{ color: "var(--text-white)" }}>
                {completedDays} / {totalDays} days
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--bg-dark)" }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className="h-full rounded-full"
                style={{
                  backgroundColor: isComplete ? "#22c55e" : "var(--accent-primary)",
                }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm lowercase">
          <div className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
            <Clock className="h-4 w-4" />
            <span>started {formattedDate.toLowerCase()}</span>
          </div>
          {hasLockedGraph && !isComplete && daysRemaining > 0 && (
            <span style={{ color: "var(--text-gray)" }}>
              {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
