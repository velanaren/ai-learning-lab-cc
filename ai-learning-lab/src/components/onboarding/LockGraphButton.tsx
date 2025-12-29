"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight, AlertTriangle } from "lucide-react";
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

interface LockGraphButtonProps {
  onLock: () => Promise<void>;
  disabled: boolean;
}

export function LockGraphButton({ onLock, disabled }: LockGraphButtonProps) {
  const [open, setOpen] = useState(false);
  const [isLocking, setIsLocking] = useState(false);

  const handleLock = async () => {
    setIsLocking(true);
    try {
      await onLock();
      setOpen(false);
    } catch (error) {
      console.error("Lock failed:", error);
      setIsLocking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          className="group h-14 rounded-2xl bg-zinc-900 px-8 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1 sm:max-w-xs"
        >
          <span className="flex items-center gap-2">
            Lock & Start Learning
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-xl font-medium tracking-tight text-zinc-900">
            Ready to Lock Your Learning Path?
          </DialogTitle>
          <DialogDescription className="text-base text-zinc-500">
            Once locked, your learning path becomes immutable. This ensures
            consistent progress tracking and prevents accidental changes.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-2xl bg-zinc-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-zinc-700">
              What happens next:
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-zinc-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                Your learning path will be finalized
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                Daily learning units will be generated
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                You can start learning immediately
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLocking}
            className="h-12 rounded-xl border-2 border-zinc-200 px-6 text-base font-medium hover:border-zinc-300 hover:bg-zinc-50"
          >
            Review Again
          </Button>
          <Button
            onClick={handleLock}
            disabled={isLocking}
            className="h-12 rounded-xl bg-zinc-900 px-6 text-base font-medium shadow-lg shadow-zinc-900/20 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLocking ? (
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
                Locking...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Lock & Continue
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
