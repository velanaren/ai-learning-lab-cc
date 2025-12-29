"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface DayNavigationProps {
  currentDay: number;
  totalDays: number;
  completedDays: number;
}

export function DayNavigation({
  currentDay,
  totalDays,
  completedDays,
}: DayNavigationProps) {
  const router = useRouter();

  const goToPreviousDay = () => {
    if (currentDay > 1) {
      router.push(`/dashboard/today?day=${currentDay - 1}`);
    }
  };

  const goToNextDay = () => {
    if (currentDay < totalDays) {
      router.push(`/dashboard/today?day=${currentDay + 1}`);
    }
  };

  const progressPercent = (completedDays / totalDays) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-lg shadow-zinc-200/30"
    >
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousDay}
          disabled={currentDay === 1}
          className="rounded-xl px-3 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-40"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>

        {/* Center Info */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            {currentDay <= completedDays && (
              <Check className="h-4 w-4 text-green-500" />
            )}
            <span className="text-lg font-medium text-zinc-900">
              Day {currentDay}
            </span>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-500">{totalDays}</span>
          </div>
          <p className="text-xs text-zinc-400">
            {completedDays} of {totalDays} completed
          </p>
        </div>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextDay}
          disabled={currentDay === totalDays}
          className="rounded-xl px-3 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-40"
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <Progress value={progressPercent} className="h-1.5" />
      </div>
    </motion.div>
  );
}
