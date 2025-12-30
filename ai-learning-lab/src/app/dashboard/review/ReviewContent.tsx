"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Zap,
  MessageSquare,
  CheckCircle2,
  Circle,
  Sparkles,
} from "lucide-react";
import { AdjustmentCard } from "@/components/review/AdjustmentCard";
import { applyAdjustment } from "@/app/actions/apply-adjustment";
import type { WeeklyReviewData } from "@/lib/gemini/prompts";

interface ReviewContentProps {
  review: WeeklyReviewData;
}

function InsightCard({
  icon: Icon,
  title,
  content,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  content: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-lg shadow-zinc-200/30"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
        <Icon className="h-5 w-5 text-zinc-600" />
      </div>
      <h3 className="text-sm font-medium text-zinc-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{content}</p>
    </motion.div>
  );
}

function ProgressVisualization({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const days = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30"
    >
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
        Daily Progress
      </h3>
      <div className="flex items-center gap-2">
        {days.map((day) => {
          const isCompleted = day <= completed;
          return (
            <motion.div
              key={day}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + day * 0.05 }}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  isCompleted
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-400"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
              <span className="text-xs text-zinc-400">Day {day}</span>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-zinc-500">
          {completed} of {total} days completed
        </span>
        <span className="font-medium text-zinc-900">
          {Math.round((completed / total) * 100)}%
        </span>
      </div>
    </motion.div>
  );
}

function ConceptsList({ concepts }: { concepts: string[] }) {
  if (concepts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30"
    >
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
        Concepts Covered
      </h3>
      <ul className="space-y-2">
        {concepts.map((concept, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.05 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-700">
              {index + 1}
            </div>
            <span className="text-sm text-zinc-700">{concept}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function NextWeekPreview({ preview }: { preview: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 text-white shadow-xl"
    >
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-amber-400" />
        <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-400">
          Coming Up Next Week
        </h3>
      </div>
      <p className="text-lg font-medium leading-relaxed">{preview}</p>
    </motion.div>
  );
}

export function ReviewContent({ review }: ReviewContentProps) {
  const handleApplyAdjustment = async () => {
    const result = await applyAdjustment(review.adjustmentSuggestion.type);
    if (!result.success) {
      console.error("Failed to apply adjustment:", result.error);
      throw new Error(result.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30 sm:p-8"
      >
        <h2 className="mb-4 text-lg font-medium text-zinc-900">
          This Week&apos;s Progress
        </h2>
        <p className="text-base leading-relaxed text-zinc-600">
          {review.progressSummary}
        </p>
      </motion.div>

      {/* Insights Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <InsightCard
          icon={TrendingUp}
          title="Pacing"
          content={review.insights.pacing}
          delay={0.1}
        />
        <InsightCard
          icon={Zap}
          title="Application"
          content={review.insights.application}
          delay={0.15}
        />
        <InsightCard
          icon={MessageSquare}
          title="Engagement"
          content={review.insights.engagement}
          delay={0.2}
        />
      </div>

      {/* Progress Visualization */}
      <ProgressVisualization
        completed={review.weekData.completedDays}
        total={review.weekData.totalDays}
      />

      {/* Concepts List */}
      <ConceptsList concepts={review.weekData.conceptsCovered} />

      {/* Adjustment Suggestion */}
      <AdjustmentCard
        adjustment={review.adjustmentSuggestion}
        onApply={handleApplyAdjustment}
      />

      {/* Next Week Preview */}
      <NextWeekPreview preview={review.nextWeekPreview} />
    </div>
  );
}
