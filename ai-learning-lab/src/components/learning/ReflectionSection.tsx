"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ReflectionSectionProps {
  prompts: string[];
  conceptId: string;
  onAnswersChange: (answers: string[]) => void;
  disabled?: boolean;
}

// Safe localStorage helper with error handling
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      console.warn("localStorage not available");
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      // Handle quota exceeded or other errors
      console.warn("Failed to save to localStorage:", error);
      return false;
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore errors
    }
  },
};

export function ReflectionSection({
  prompts,
  conceptId,
  onAnswersChange,
  disabled = false,
}: ReflectionSectionProps) {
  const [answers, setAnswers] = useState<string[]>(Array(prompts.length).fill(""));
  const storageKey = `reflection-answers-${conceptId}`;

  // Debounce timer ref
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved answers from localStorage on mount
  useEffect(() => {
    const saved = safeLocalStorage.getItem(storageKey);
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
  }, [storageKey, prompts.length, onAnswersChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Debounced save to localStorage
  const debouncedSave = useCallback((newAnswers: string[]) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout (500ms debounce)
    saveTimeoutRef.current = setTimeout(() => {
      safeLocalStorage.setItem(storageKey, JSON.stringify(newAnswers));
    }, 500);
  }, [storageKey]);

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);

    // Debounced auto-save to localStorage
    debouncedSave(newAnswers);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-6 rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30 sm:p-8"
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
              maxLength={5000}
              className="min-h-24 resize-none rounded-xl border-zinc-200 bg-zinc-50/50 p-4 text-base transition-all duration-200 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-900/10 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
