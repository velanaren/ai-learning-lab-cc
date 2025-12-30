"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  TrendingDown,
  TrendingUp,
  Zap,
  Layers,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import type { AdjustmentSuggestion } from "@/lib/gemini/prompts";

interface AdjustmentCardProps {
  adjustment: AdjustmentSuggestion;
  onApply: () => Promise<void>;
}

const adjustmentConfig = {
  pace_down: {
    icon: TrendingDown,
    label: "Slow Down Pace",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  pace_up: {
    icon: TrendingUp,
    label: "Speed Up Pace",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  more_application: {
    icon: Zap,
    label: "More Practice",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  smaller_chunks: {
    icon: Layers,
    label: "Smaller Steps",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  none: {
    icon: CheckCircle2,
    label: "On Track",
    bgColor: "bg-zinc-50",
    borderColor: "border-zinc-200",
    iconBg: "bg-zinc-100",
    iconColor: "text-zinc-600",
  },
};

export function AdjustmentCard({ adjustment, onApply }: AdjustmentCardProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const config = adjustmentConfig[adjustment.type];
  const Icon = config.icon;

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await onApply();
      setApplied(true);
    } catch (error) {
      console.error("Failed to apply adjustment:", error);
    } finally {
      setIsApplying(false);
    }
  };

  // Don't render if type is "none", dismissed, or already applied
  if (adjustment.type === "none") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-green-200 bg-green-50 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-green-900">You&apos;re on track!</h3>
            <p className="mt-1 text-sm text-green-700">{adjustment.reason}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!dismissed && !applied ? (
        <motion.div
          key="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`rounded-3xl border ${config.borderColor} ${config.bgColor} p-6`}
        >
          {/* Header */}
          <div className="mb-4 flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.iconBg}`}
            >
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-zinc-600">
                  Suggested Adjustment
                </span>
                <Sparkles className="h-4 w-4 text-amber-500" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900">{config.label}</h3>
            </div>
          </div>

          {/* Content */}
          <div className="mb-6 space-y-3">
            <div>
              <p className="text-sm font-medium text-zinc-700">Why we suggest this:</p>
              <p className="mt-1 text-sm text-zinc-600">{adjustment.reason}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-700">What will change:</p>
              <p className="mt-1 text-sm text-zinc-600">{adjustment.description}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleApply}
              disabled={isApplying}
              className="h-12 flex-1 rounded-xl bg-zinc-900 font-medium shadow-lg shadow-zinc-900/20 hover:bg-zinc-800"
            >
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply Adjustment"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => setDismissed(true)}
              className="h-12 flex-1 rounded-xl border-2 border-zinc-200 hover:bg-white"
            >
              Keep Current Pace
            </Button>
          </div>
        </motion.div>
      ) : applied ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center rounded-3xl border border-green-200 bg-green-50 py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100"
          >
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </motion.div>
          <p className="text-lg font-medium text-green-900">Adjustment Applied!</p>
          <p className="mt-1 text-sm text-green-700">
            Your learning path will adapt accordingly.
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="dismissed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 text-center"
        >
          <p className="text-sm text-zinc-600">
            Got it! We&apos;ll check in again next week.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
