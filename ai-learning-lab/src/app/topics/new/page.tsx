"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Target,
  Zap,
  RefreshCw,
  Settings,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkUserStatus, createNewTopic } from "./actions";

type Step = "topic" | "preferences";

export default function NewTopicPage() {
  const [step, setStep] = useState<Step>("topic");
  const [topic, setTopic] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const [canCreateMore, setCanCreateMore] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const [selectedOption, setSelectedOption] = useState<"reuse" | "customize" | null>(null);

  // Check user status on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const status = await checkUserStatus();
        setHasExistingProfile(status.hasProfile);
        setCanCreateMore(status.canCreateMore);

        if (!status.canCreateMore) {
          setError("You've reached the maximum of 2 learning topics. Complete or remove a topic to add more.");
        }
      } catch (err) {
        console.error("Error checking status:", err);
      } finally {
        setIsChecking(false);
      }
    }
    checkStatus();
  }, []);

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!topic.trim() || topic.trim().length < 2) {
      setError("Please enter a valid topic (at least 2 characters)");
      return;
    }

    // If user has existing profile, show preferences choice
    if (hasExistingProfile) {
      setStep("preferences");
    } else {
      // First topic, go directly to questionnaire
      startTransition(async () => {
        try {
          await createNewTopic(topic.trim(), false);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      });
    }
  };

  const handlePreferencesSubmit = async () => {
    if (!selectedOption) {
      setError("Please select an option");
      return;
    }

    startTransition(async () => {
      try {
        await createNewTopic(topic.trim(), selectedOption === "reuse");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  const features = [
    {
      icon: Target,
      title: "Personalized Path",
      description: "Tailored to your experience level",
    },
    {
      icon: BookOpen,
      title: "Daily Learning",
      description: "Bite-sized concepts, consistent progress",
    },
    {
      icon: Zap,
      title: "Hands-on Practice",
      description: "Learn by building real things",
    },
  ];

  if (isChecking) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute left-4 top-4 sm:left-6 sm:top-6"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xl"
        >
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-medium text-zinc-900">
                AI Learning Lab
              </span>
            </div>
          </motion.div>

          {/* Main Card */}
          <AnimatePresence mode="wait">
            {step === "topic" ? (
              <motion.div
                key="topic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/80 p-8 shadow-xl shadow-zinc-200/50 backdrop-blur-xl sm:p-10"
              >
                {/* Header */}
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
                    Add a new topic
                  </h1>
                  <p className="mt-3 text-base leading-relaxed text-zinc-500">
                    Enter any technical topic. We&apos;ll create a personalized
                    learning path just for you.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleTopicSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        id="topic"
                        name="topic"
                        value={topic}
                        onChange={(e) => {
                          setTopic(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="e.g., Docker, Kubernetes, React hooks..."
                        className="h-14 rounded-2xl border-zinc-200 bg-zinc-50/50 pl-5 pr-5 text-base transition-all duration-200 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-900/10"
                        required
                        autoFocus
                        disabled={isPending || !canCreateMore}
                      />
                    </div>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPending || !topic.trim() || !canCreateMore}
                    className="group h-14 w-full rounded-2xl bg-zinc-900 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending ? (
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
                        Continue
                        <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="my-8 flex items-center gap-4">
                  <div className="h-px flex-1 bg-zinc-200" />
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                    What you&apos;ll get
                  </span>
                  <div className="h-px flex-1 bg-zinc-200" />
                </div>

                {/* Features */}
                <div className="grid gap-4 sm:grid-cols-3">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                      className="group flex flex-col items-center rounded-2xl bg-zinc-50/80 p-4 text-center transition-colors duration-200 hover:bg-zinc-100/80"
                    >
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition-shadow duration-200 group-hover:shadow-md">
                        <feature.icon className="h-5 w-5 text-zinc-600" />
                      </div>
                      <h3 className="text-sm font-medium text-zinc-900">
                        {feature.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/80 p-8 shadow-xl shadow-zinc-200/50 backdrop-blur-xl sm:p-10"
              >
                {/* Header */}
                <div className="mb-8 text-center">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2">
                    <BookOpen className="h-4 w-4 text-zinc-600" />
                    <span className="text-sm font-medium text-zinc-600">
                      {topic}
                    </span>
                  </div>
                  <h1 className="text-2xl font-medium tracking-tight text-zinc-900 sm:text-3xl">
                    Learning preferences
                  </h1>
                  <p className="mt-3 text-base leading-relaxed text-zinc-500">
                    You already have learning preferences saved. Would you like
                    to use them for this topic?
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedOption("reuse")}
                    className={`relative flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                      selectedOption === "reuse"
                        ? "border-zinc-900 bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        selectedOption === "reuse"
                          ? "bg-white/20"
                          : "bg-zinc-100"
                      }`}
                    >
                      <RefreshCw
                        className={`h-6 w-6 ${
                          selectedOption === "reuse"
                            ? "text-white"
                            : "text-zinc-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${
                          selectedOption === "reuse"
                            ? "text-white"
                            : "text-zinc-900"
                        }`}
                      >
                        Use existing preferences
                      </h3>
                      <p
                        className={`mt-0.5 text-sm ${
                          selectedOption === "reuse"
                            ? "text-zinc-300"
                            : "text-zinc-500"
                        }`}
                      >
                        Skip questionnaire, go directly to building your
                        learning path
                      </p>
                    </div>
                    {selectedOption === "reuse" && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                        <Check className="h-4 w-4 text-zinc-900" />
                      </div>
                    )}
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedOption("customize")}
                    className={`relative flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                      selectedOption === "customize"
                        ? "border-zinc-900 bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        selectedOption === "customize"
                          ? "bg-white/20"
                          : "bg-zinc-100"
                      }`}
                    >
                      <Settings
                        className={`h-6 w-6 ${
                          selectedOption === "customize"
                            ? "text-white"
                            : "text-zinc-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${
                          selectedOption === "customize"
                            ? "text-white"
                            : "text-zinc-900"
                        }`}
                      >
                        Customize preferences
                      </h3>
                      <p
                        className={`mt-0.5 text-sm ${
                          selectedOption === "customize"
                            ? "text-zinc-300"
                            : "text-zinc-500"
                        }`}
                      >
                        Answer questions to tailor this learning path
                        specifically
                      </p>
                    </div>
                    {selectedOption === "customize" && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                        <Check className="h-4 w-4 text-zinc-900" />
                      </div>
                    )}
                  </motion.button>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-sm text-red-500"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStep("topic");
                      setSelectedOption(null);
                      setError(null);
                    }}
                    className="h-14 flex-1 rounded-2xl border-2 border-zinc-200 px-8 text-base font-medium transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handlePreferencesSubmit}
                    disabled={isPending || !selectedOption}
                    className="group h-14 flex-1 rounded-2xl bg-zinc-900 px-8 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending ? (
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
                        Creating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Continue
                        <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                      </span>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Examples */}
          {step === "topic" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-zinc-400">
                Popular topics:{" "}
                <span className="text-zinc-500">
                  Docker • Kubernetes • React • PostgreSQL • System Design
                </span>
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
