"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Brain, Layers, Sparkles, BookOpen } from "lucide-react";

interface GenerationStep {
  id: string;
  label: string;
  icon: React.ElementType;
  duration: number; // How long this step typically takes in ms
}

const GENERATION_STEPS: GenerationStep[] = [
  {
    id: "analyzing",
    label: "Analyzing your learning profile...",
    icon: Brain,
    duration: 3000,
  },
  {
    id: "creating",
    label: "Creating concept structure...",
    icon: Layers,
    duration: 8000,
  },
  {
    id: "generating",
    label: "Generating learning content...",
    icon: BookOpen,
    duration: 12000,
  },
  {
    id: "validating",
    label: "Validating learning path...",
    icon: Sparkles,
    duration: 5000,
  },
];

interface GenerationProgressProps {
  isGenerating: boolean;
}

export function GenerationProgress({ isGenerating }: GenerationProgressProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStepIndex(0);
      setCompletedSteps(new Set());
      return;
    }

    // Reset when generation starts
    setCurrentStepIndex(0);
    setCompletedSteps(new Set());

    // Progress through steps
    let cumulativeTime = 0;
    const timeouts: NodeJS.Timeout[] = [];

    GENERATION_STEPS.forEach((step, index) => {
      // Move to next step
      const stepTimeout = setTimeout(() => {
        if (index < GENERATION_STEPS.length - 1) {
          setCompletedSteps((prev) => new Set([...prev, step.id]));
          setCurrentStepIndex(index + 1);
        }
      }, cumulativeTime + step.duration);

      timeouts.push(stepTimeout);
      cumulativeTime += step.duration;
    });

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [isGenerating]);

  if (!isGenerating) {
    return null;
  }

  const currentStep = GENERATION_STEPS[currentStepIndex];

  return (
    <div className="space-y-6 py-4">
      {/* Current Step Highlight */}
      <motion.div
        key={currentStep.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center justify-center gap-3"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
        >
          <currentStep.icon className="h-6 w-6 text-zinc-600" />
        </motion.div>
        <p className="text-base font-medium text-zinc-700">{currentStep.label}</p>
      </motion.div>

      {/* Step Indicators */}
      <div className="flex justify-center gap-2">
        {GENERATION_STEPS.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isCurrent = index === currentStepIndex;

          return (
            <motion.div
              key={step.id}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: isCurrent ? 1.1 : 1,
                opacity: isCompleted || isCurrent ? 1 : 0.4,
              }}
              transition={{ duration: 0.3 }}
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                isCompleted
                  ? "bg-green-100"
                  : isCurrent
                    ? "bg-zinc-900"
                    : "bg-zinc-100"
              }`}
            >
              {isCompleted ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : isCurrent ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <span className="text-xs font-medium text-zinc-400">
                  {index + 1}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mx-auto max-w-xs">
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
          <motion.div
            className="h-full bg-zinc-900"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentStepIndex + 1) / GENERATION_STEPS.length) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-zinc-400">
          Step {currentStepIndex + 1} of {GENERATION_STEPS.length}
        </p>
      </div>
    </div>
  );
}
