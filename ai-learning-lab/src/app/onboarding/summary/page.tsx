"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Target,
  Route,
  Settings,
  XCircle,
  ArrowRight,
  Pencil,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { Logo, LogoAnimated } from "@/components/brand";
import { AccessibilityToolbar } from "@/components/accessibility/AccessibilityToolbar";
import { confirmAndContinue } from "./actions";

interface SectionData {
  title: string;
  content: string[];
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

function parseSummaryToSections(markdown: string): SectionData[] {
  const sections: SectionData[] = [];

  // Split by ## headers
  const parts = markdown.split(/^## /m).filter(Boolean);

  const iconMap: Record<string, { icon: React.ReactNode; color: string; bgColor: string; borderColor: string }> = {
    "Who You Are": {
      icon: <User className="h-5 w-5" />,
      color: "#60a5fa",
      bgColor: "rgba(96, 165, 250, 0.1)",
      borderColor: "rgba(96, 165, 250, 0.2)"
    },
    "What You Want to Achieve": {
      icon: <Target className="h-5 w-5" />,
      color: "#34d399",
      bgColor: "rgba(52, 211, 153, 0.1)",
      borderColor: "rgba(52, 211, 153, 0.2)"
    },
    "How We'll Design Your Learning Path": {
      icon: <Route className="h-5 w-5" />,
      color: "#a78bfa",
      bgColor: "rgba(167, 139, 250, 0.1)",
      borderColor: "rgba(167, 139, 250, 0.2)"
    },
    "Learning Comfort Defaults": {
      icon: <Settings className="h-5 w-5" />,
      color: "#fbbf24",
      bgColor: "rgba(251, 191, 36, 0.1)",
      borderColor: "rgba(251, 191, 36, 0.2)"
    },
    "What We'll Emphasize": {
      icon: <LogoAnimated className="h-5 w-5" />,
      color: "var(--accent-primary)",
      bgColor: "var(--accent-glow)",
      borderColor: "rgba(203, 254, 0, 0.2)"
    },
    "What We'll Skip or Minimize": {
      icon: <XCircle className="h-5 w-5" />,
      color: "var(--text-gray)",
      bgColor: "var(--bg-dark)",
      borderColor: "rgba(255, 255, 255, 0.06)"
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
      color: "var(--text-gray)",
      bgColor: "var(--bg-dark)",
      borderColor: "rgba(255, 255, 255, 0.06)"
    };

    sections.push({
      title,
      content,
      icon: iconConfig.icon,
      color: iconConfig.color,
      bgColor: iconConfig.bgColor,
      borderColor: iconConfig.borderColor,
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
      className="card-dark p-5 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: section.bgColor }}
        >
          <div style={{ color: section.color }}>{section.icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className="text-base font-semibold lowercase mb-2"
            style={{ color: "var(--text-white)" }}
          >
            {section.title.toLowerCase()}
          </h3>
          {isBulletList ? (
            <ul className="space-y-2">
              {section.content.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm lowercase">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#22c55e" }} />
                  <span style={{ color: "var(--text-gray)" }}>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-2">
              {section.content.map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed lowercase" style={{ color: "var(--text-gray)" }}>
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

// Loading fallback component
function SummaryLoading() {
  return (
    <div className="landing-page">
      <div className="noise-overlay decorative-bg" data-decorative="true" />
      <div className="hero-gradient" data-decorative="true" style={{ opacity: 0.3 }} />
      <div className="relative flex min-h-screen items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4"
          style={{
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderTopColor: "var(--accent-primary)",
          }}
        />
      </div>
    </div>
  );
}

export default function SummaryPage() {
  return (
    <Suspense fallback={<SummaryLoading />}>
      <SummaryContent />
    </Suspense>
  );
}

function SummaryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topicId") || undefined;
  const [summary, setSummary] = useState<string>("");
  const [topicName, setTopicName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchSummary() {
      try {
        const url = topicId
          ? `/api/onboarding/summary?topicId=${topicId}`
          : "/api/onboarding/summary";
        const response = await fetch(url, {
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
  }, [topicId]);

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await confirmAndContinue(topicId);
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
      <div className="landing-page">
        <div className="noise-overlay decorative-bg" data-decorative="true" />
        <div className="hero-gradient" data-decorative="true" style={{ opacity: 0.3 }} />

        <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            <div
              className="card-dark p-8"
              style={{ borderColor: "rgba(239, 68, 68, 0.3)" }}
            >
              <div
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl"
                style={{ backgroundColor: "rgba(239, 68, 68, 0.15)" }}
              >
                <AlertCircle className="h-7 w-7" style={{ color: "#ef4444" }} />
              </div>
              <h2 className="text-section-title mb-2">something went wrong</h2>
              <p className="text-body mb-6">{error}</p>
              <button onClick={handleEdit} className="btn-accent w-full">
                return to questionnaire
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Background effects */}
      <div className="noise-overlay decorative-bg" data-decorative="true" />
      <div className="hero-gradient" data-decorative="true" style={{ opacity: 0.3 }} />

      {/* Header */}
      <header className="relative">
        <div
          className="container mx-auto flex items-center justify-between px-6"
          style={{ height: "var(--space-10)" }}
        >
          <Logo size="md" className="animate-fade-in-up" />
          <div className="animate-fade-in-up animate-delay-1">
            <AccessibilityToolbar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-12)" }}>
        <div className="container mx-auto max-w-3xl px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                backgroundColor: "var(--accent-glow)",
              }}
            >
              <LogoAnimated className="h-4 w-4" />
              <span className="text-sm font-medium lowercase" style={{ color: "var(--accent-primary)" }}>
                your learning contract
              </span>
            </div>
            <h1 className="text-section-title">
              {isLoading ? (
                "creating your personalized plan..."
              ) : (
                <>
                  your <span style={{ color: "var(--accent-primary)" }}>{topicName?.toLowerCase()}</span>{" "}
                  journey
                </>
              )}
            </h1>
            <p className="text-body mx-auto mt-3 max-w-xl">
              {isLoading
                ? "we're analyzing your preferences to design the perfect learning experience."
                : "here's how we understood your needs. review and confirm to continue."}
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
                  className="card-dark p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="skeleton h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <div className="skeleton h-5 w-48 rounded-lg" />
                      <div className="space-y-2">
                        <div className="skeleton h-4 w-full rounded-lg" />
                        <div className="skeleton h-4 w-3/4 rounded-lg" />
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
              className="mt-8 rounded-xl p-5"
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "rgba(34, 197, 94, 0.15)" }}
                >
                  <Lightbulb className="h-5 w-5" style={{ color: "#22c55e" }} />
                </div>
                <div>
                  <h3
                    className="text-base font-semibold lowercase"
                    style={{ color: "#22c55e" }}
                  >
                    ready to start learning?
                  </h3>
                  <p className="mt-1 text-sm lowercase" style={{ color: "rgba(34, 197, 94, 0.8)" }}>
                    if this looks right, confirm to generate your personalized learning path.
                    you can always adjust your preferences later.
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
            <button
              onClick={handleConfirm}
              disabled={isLoading || isPending}
              className="btn-accent group sm:flex-1 sm:max-w-xs disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="h-5 w-5 rounded-full border-2"
                    style={{
                      borderColor: "rgba(0, 0, 0, 0.3)",
                      borderTopColor: "var(--bg-dark)",
                    }}
                  />
                  please wait...
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
                    className="h-5 w-5 rounded-full border-2"
                    style={{
                      borderColor: "rgba(0, 0, 0, 0.3)",
                      borderTopColor: "var(--bg-dark)",
                    }}
                  />
                  creating your path...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  confirm & generate path
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              )}
            </button>
            <button
              onClick={handleEdit}
              disabled={isLoading || isPending}
              className="btn-outline sm:flex-1 sm:max-w-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Pencil className="h-5 w-5" />
              edit my answers
            </button>
          </motion.div>

          {/* Helper Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 text-center text-sm lowercase"
            style={{ color: "var(--text-muted)" }}
          >
            review the summary above. if something doesn&apos;t look right,
            go back and update your answers.
          </motion.p>
        </div>
      </main>
    </div>
  );
}
