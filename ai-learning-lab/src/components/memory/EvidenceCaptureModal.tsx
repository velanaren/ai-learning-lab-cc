"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Github,
  Link as LinkIcon,
  FileCode,
  Terminal,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Camera,
} from "lucide-react";

type EvidenceType = "link" | "code_snippet" | "screenshot" | "output";

interface EvidenceCaptureModalProps {
  memoryEntryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export function EvidenceCaptureModal({
  memoryEntryId,
  open,
  onOpenChange,
  onComplete,
}: EvidenceCaptureModalProps) {
  const [mode, setMode] = useState<"choice" | "manual" | "github">("choice");
  const [evidenceType, setEvidenceType] = useState<EvidenceType>("link");
  const [content, setContent] = useState("");
  const [label, setLabel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Debounce ref to prevent double submissions
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSubmitRef = useRef<number>(0);

  const resetForm = () => {
    setMode("choice");
    setEvidenceType("link");
    setContent("");
    setLabel("");
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSkip = () => {
    handleClose();
    onComplete?.();
  };

  const handleSubmit = useCallback(async () => {
    // Debounce: prevent submissions within 1 second of each other
    const now = Date.now();
    if (now - lastSubmitRef.current < 1000) {
      return;
    }
    lastSubmitRef.current = now;

    if (!content.trim()) {
      setError("Please enter the evidence content or URL");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memoryEntryId,
          type: evidenceType,
          urlOrBlobRef: content.trim(),
          label: label.trim() || null,
          sourceType: "self_reported",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save evidence");
      }

      setSuccess(true);
      submitTimeoutRef.current = setTimeout(() => {
        handleClose();
        onComplete?.();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save evidence");
    } finally {
      setIsSubmitting(false);
    }
  }, [content, evidenceType, label, memoryEntryId, onComplete]);

  const evidenceTypeConfig = {
    link: {
      icon: LinkIcon,
      label: "Link",
      placeholder: "https://example.com/my-project",
      description: "A URL to your work (blog post, deployed app, etc.)",
    },
    code_snippet: {
      icon: FileCode,
      label: "Code Snippet",
      placeholder: "Paste your code here...",
      description: "A piece of code you wrote while learning",
    },
    screenshot: {
      icon: Camera,
      label: "Screenshot URL",
      placeholder: "https://imgur.com/...",
      description: "Link to a screenshot of your work",
    },
    output: {
      icon: Terminal,
      label: "Terminal Output",
      placeholder: "$ docker run hello-world\nHello from Docker!...",
      description: "Command output showing your work in action",
    },
  };

  const slideVariants = {
    enter: { x: 20, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium tracking-tight">
            Add Evidence
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Capture proof of what you built or learned. This makes your progress
            tangible and shareable.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
              >
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </motion.div>
              <p className="text-lg font-medium text-zinc-900">Evidence saved!</p>
            </motion.div>
          ) : mode === "choice" ? (
            <motion.div
              key="choice"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-3 py-4"
            >
              {/* GitHub Import - Coming Soon */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="w-full"
              >
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-4 rounded-2xl border-2 opacity-50 cursor-not-allowed"
                  disabled
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900">
                    <Github className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Import from GitHub</p>
                    <p className="text-xs text-zinc-400">Coming soon</p>
                  </div>
                </Button>
              </motion.div>

              {/* Manual Entry */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full"
              >
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-4 rounded-2xl border-2 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all duration-200"
                  onClick={() => setMode("manual")}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                    <FileCode className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Paste output or link</p>
                    <p className="text-xs text-zinc-500">
                      Add a link, code snippet, or terminal output
                    </p>
                  </div>
                </Button>
              </motion.div>

              {/* Skip */}
              <Button
                variant="ghost"
                className="w-full text-zinc-400 hover:text-zinc-600 transition-colors"
                onClick={handleSkip}
              >
                Skip for now
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="manual"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-4 py-4"
            >
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                className="mb-2 -ml-2 text-zinc-500 hover:text-zinc-700"
                onClick={() => setMode("choice")}
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>

              {/* Type Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">Evidence type</Label>
                <Select
                  value={evidenceType}
                  onValueChange={(v) => setEvidenceType(v as EvidenceType)}
                >
                  <SelectTrigger className="h-12 rounded-xl border-zinc-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(evidenceTypeConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <config.icon className="h-4 w-4 text-zinc-500" />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-zinc-400">
                  {evidenceTypeConfig[evidenceType].description}
                </p>
              </div>

              {/* Content Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">
                  {evidenceType === "link" || evidenceType === "screenshot"
                    ? "URL"
                    : "Content"}
                </Label>
                <Textarea
                  placeholder={evidenceTypeConfig[evidenceType].placeholder}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={evidenceType === "code_snippet" || evidenceType === "output" ? 6 : 2}
                  className={`rounded-xl border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 transition-all ${
                    evidenceType === "code_snippet" || evidenceType === "output"
                      ? "font-mono text-sm"
                      : ""
                  }`}
                />
              </div>

              {/* Label Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">
                  Label <span className="text-zinc-400 font-normal">(optional)</span>
                </Label>
                <Input
                  placeholder="e.g., My first Docker container"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="h-12 rounded-xl border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 transition-all"
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-2 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all"
                  onClick={() => setMode("choice")}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-12 rounded-xl bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25 transition-all duration-200"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Evidence"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
