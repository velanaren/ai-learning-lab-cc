"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTopic } from "./actions";

export default function OnboardingPage() {
  const [topic, setTopic] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!topic.trim() || topic.trim().length < 2) {
      setError("Please enter a valid topic (at least 2 characters)");
      return;
    }

    startTransition(async () => {
      try {
        await createTopic(topic.trim());
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

      {/* Skip to main content - Accessibility */}
      <a
        href="#topic-form"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
      >
        Skip to topic selection
      </a>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/80 p-8 shadow-xl shadow-zinc-200/50 backdrop-blur-xl sm:p-10"
          >
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
                What do you want to learn?
              </h1>
              <p className="mt-3 text-base leading-relaxed text-zinc-500">
                Enter any technical topic. We&apos;ll create a personalized
                learning path just for you.
              </p>
            </div>

            {/* Form */}
            <form
              id="topic-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
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
                    disabled={isPending}
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
                disabled={isPending || !topic.trim()}
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

          {/* Examples */}
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
        </motion.div>
      </div>
    </div>
  );
}
