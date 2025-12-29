"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface RegenerateButtonProps {
  onRegenerate: (feedback: string) => Promise<void>;
  isLoading: boolean;
}

export function RegenerateButton({
  onRegenerate,
  isLoading,
}: RegenerateButtonProps) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegenerate = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      await onRegenerate(feedback.trim());
      setOpen(false);
      setFeedback("");
    } catch (error) {
      console.error("Regeneration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={isLoading}
          className="h-14 rounded-2xl border-2 border-zinc-200 px-8 text-base font-medium transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1 sm:max-w-xs"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Regenerate with Feedback
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
            <MessageSquare className="h-6 w-6 text-zinc-600" />
          </div>
          <DialogTitle className="text-xl font-medium tracking-tight text-zinc-900">
            Provide Feedback
          </DialogTitle>
          <DialogDescription className="text-base text-zinc-500">
            Tell us what you'd like to change about this learning path. We'll
            regenerate it based on your feedback.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="E.g., Add more concepts about networking, reduce beginner concepts, include more practical examples..."
            className="min-h-32 resize-none rounded-2xl border-zinc-200 bg-zinc-50/50 p-4 text-base transition-all duration-200 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
          />
          <p className="mt-2 text-sm text-zinc-400">
            Be specific about what you want to add, remove, or change.
          </p>
        </div>

        <DialogFooter className="gap-3 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
            className="h-12 rounded-xl border-2 border-zinc-200 px-6 text-base font-medium hover:border-zinc-300 hover:bg-zinc-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRegenerate}
            disabled={isSubmitting || !feedback.trim()}
            className="h-12 rounded-xl bg-zinc-900 px-6 text-base font-medium shadow-lg shadow-zinc-900/20 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                  className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                />
                Regenerating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
