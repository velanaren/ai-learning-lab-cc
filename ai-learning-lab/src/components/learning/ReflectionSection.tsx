"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ReflectionSectionProps {
  prompts: string[];
  onAnswersChange: (answers: string[]) => void;
  disabled?: boolean;
}

export function ReflectionSection({
  prompts,
  onAnswersChange,
  disabled = false,
}: ReflectionSectionProps) {
  const [answers, setAnswers] = useState<string[]>(Array(prompts.length).fill(""));

  // Load saved answers from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("reflection-answers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === prompts.length) {
          setAnswers(parsed);
          onAnswersChange(parsed);
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, [prompts.length, onAnswersChange]);

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);

    // Auto-save to localStorage
    localStorage.setItem("reflection-answers", JSON.stringify(newAnswers));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30 sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
          <MessageSquare className="h-5 w-5 text-zinc-600" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-zinc-900">Reflection</h2>
          <p className="text-sm text-zinc-500">
            Take a moment to think about what you learned (optional)
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {prompts.map((prompt, index) => (
          <div key={index}>
            <Label className="mb-2 block text-sm font-medium text-zinc-700">
              {prompt}
            </Label>
            <Textarea
              value={answers[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder="Your thoughts..."
              disabled={disabled}
              className="min-h-24 resize-none rounded-xl border-zinc-200 bg-zinc-50/50 p-4 text-base transition-all duration-200 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
