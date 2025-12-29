"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Target,
  Route,
  Settings,
  Sparkles,
  XCircle,
  ArrowRight,
  Pencil,
  AlertCircle,
  CheckCircle2,
  Clock,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmAndContinue } from "./actions";

interface SectionData {
  title: string;
  content: string[];
  icon: React.ReactNode;
  color: string;
}

function parseSummaryToSections(markdown: string): SectionData[] {
  const sections: SectionData[] = [];

  // Split by ## headers
  const parts = markdown.split(/^## /m).filter(Boolean);

  const iconMap: Record<string, { icon: React.ReactNode; color: string }> = {
    "Who You Are": {
      icon: <User className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-600 border-blue-200"
    },
    "What You Want to Achieve": {
      icon: <Target className="h-5 w-5" />,
      color: "bg-emerald-100 text-emerald-600 border-emerald-200"
    },
    "How We'll Design Your Learning Path": {
      icon: <Route className="h-5 w-5" />,
      color: "bg-violet-100 text-violet-600 border-violet-200"
    },
    "Learning Comfort Defaults": {
      icon: <Settings className="h-5 w-5" />,
      color: "bg-amber-100 text-amber-600 border-amber-200"
    },
    "What We'll Emphasize": {
      icon: <Sparkles className="h-5 w-5" />,
      color: "bg-emerald-100 text-emerald-600 border-emerald-200"
    },
    "What We'll Skip or Minimize": {
      icon: <XCircle className="h-5 w-5" />,
      color: "bg-zinc-100 text-zinc-600 border-zinc-200"
    },
  };

  for (const part of parts) {
    const lines = part.trim().split("\n");
    const title = lines[0].trim();
    const contentLines = lines.slice(1).filter(line => line.trim());

    // Parse content - handle both bullet points and paragraphs
    const content: string[] = [];
    for (const line of contentLines) {
      const cleaned = line.replace(/^[-*]\s*/, "").trim();
      if (cleaned) {
        content.push(cleaned);
      }
    }

    const iconConfig = iconMap[title] || {
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-zinc-100 text-zinc-600 border-zinc-200"
    };

    sections.push({
      title,
      content,
      icon: iconConfig.icon,
      color: iconConfig.color,
    });
  }

  return sections;
}

function SectionCard({ section, index }: { section: SectionData; index: number }) {
  const isBulletList = section.content.length > 1 &&
    (section.title.includes("Design") ||
     section.title.includes("Comfort") ||
     section.title.includes("Emphasize") ||
     section.title.includes("Skip"));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${section.color}`}>
          {section.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-zinc-900 mb-2">
            {section.title}
          </h3>
          {isBulletList ? (
            <ul className="space-y-2">
              {section.content.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-2">
              {section.content.map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed text-zinc-600">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function SummaryPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<string>("");
  const [topicName, setTopicName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch("/api/onboarding/summary", {
          method: "POST",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to generate summary");
        }

        const data = await response.json();
        setSummary(data.summary);
        setTopicName(data.topic);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSummary();
  }, []);

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await confirmAndContinue();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to confirm";
        setError(errorMessage);
      }
    });
  };

  const handleEdit = () => {
    router.push("/onboarding/questionnaire");
  };

  const sections = parseSummaryToSections(summary);

  if (error) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

        <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-xl shadow-red-100/50">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
                <AlertCircle className="h-7 w-7 text-red-600" />
              </div>
              <h2 className="text-2xl font-medium tracking-tight text-zinc-900">
                Something went wrong
              </h2>
              <p className="mt-3 text-base leading-relaxed text-zinc-500">
                {error}
              </p>
              <Button
                onClick={handleEdit}
                className="mt-6 h-14 w-full rounded-2xl bg-zinc-900 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25"
              >
                Return to Questionnaire
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

      <div className="relative py-8 sm:py-12">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center sm:mb-10"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                Your Learning Contract
              </span>
            </div>
            <h1 className="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
              {isLoading ? (
                "Creating your personalized plan..."
              ) : (
                <>
                  Your <span className="text-zinc-600">{topicName}</span>{" "}
                  Journey
                </>
              )}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-zinc-500">
              {isLoading
                ? "We're analyzing your preferences to design the perfect learning experience."
                : "Here's how we understood your needs. Review and confirm to continue."}
            </p>
          </motion.div>

          {/* Summary Sections */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="rounded-2xl border border-zinc-200/80 bg-white p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 animate-pulse rounded-xl bg-zinc-100" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-48 animate-pulse rounded-lg bg-zinc-100" />
                      <div className="space-y-2">
                        <div className="h-4 w-full animate-pulse rounded-lg bg-zinc-100" />
                        <div className="h-4 w-3/4 animate-pulse rounded-lg bg-zinc-100" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((section, index) => (
                <SectionCard key={section.title} section={section} index={index} />
              ))}
            </div>
          )}

          {/* Confirmation Card */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                  <Lightbulb className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-emerald-900">
                    Ready to start learning?
                  </h3>
                  <p className="mt-1 text-sm text-emerald-700">
                    If this looks right, confirm to generate your personalized learning path.
                    You can always adjust your preferences later.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <Button
              onClick={handleConfirm}
              disabled={isLoading || isPending}
              className="group h-14 rounded-2xl bg-zinc-900 px-8 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1 sm:max-w-xs"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                  />
                  Please wait...
                </span>
              ) : isPending ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                  />
                  Creating your path...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Confirm & Generate Path
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              )}
            </Button>
            <Button
              onClick={handleEdit}
              variant="outline"
              disabled={isLoading || isPending}
              className="h-14 rounded-2xl border-2 border-zinc-200 px-8 text-base font-medium transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1 sm:max-w-xs"
            >
              <Pencil className="mr-2 h-5 w-5" />
              Edit My Answers
            </Button>
          </motion.div>

          {/* Helper Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 text-center text-sm text-zinc-400"
          >
            Review the summary above. If something doesn&apos;t look right,
            go back and update your answers.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
