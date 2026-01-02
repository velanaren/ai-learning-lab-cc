"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Target, Zap } from "lucide-react";
import { Logo, LogoAnimated } from "@/components/brand";
import { AccessibilityToolbar } from "@/components/accessibility/AccessibilityToolbar";
import { createTopic } from "./actions";

export default function OnboardingPage() {
  const [topic, setTopic] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!topic.trim() || topic.trim().length < 2) {
      setError("please enter a valid topic (at least 2 characters)");
      return;
    }

    startTransition(async () => {
      try {
        await createTopic(topic.trim());
      } catch (err) {
        setError(err instanceof Error ? err.message : "something went wrong");
      }
    });
  };

  const features = [
    {
      icon: Target,
      title: "personalized path",
      description: "tailored to your experience level",
    },
    {
      icon: BookOpen,
      title: "daily learning",
      description: "bite-sized concepts, consistent progress",
    },
    {
      icon: Zap,
      title: "hands-on practice",
      description: "learn by building real things",
    },
  ];

  return (
    <div className="landing-page">
      {/* Background effects */}
      <div className="noise-overlay decorative-bg" data-decorative="true" />
      <div className="hero-gradient hero-glow" data-decorative="true" />

      {/* Skip to main content - Accessibility */}
      <a
        href="#topic-form"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        style={{
          backgroundColor: "var(--accent-primary)",
          color: "var(--bg-dark)",
        }}
      >
        skip to topic selection
      </a>

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
      <main className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xl"
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <LogoAnimated className="h-20 w-20" />
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="card-featured"
          >
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-section-title">
                what do you want to learn?
              </h1>
              <p className="text-body mt-3">
                enter any technical topic. we&apos;ll create a personalized
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
                  <input
                    id="topic"
                    name="topic"
                    value={topic}
                    onChange={(e) => {
                      setTopic(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g., docker, kubernetes, react hooks..."
                    className="h-14 w-full rounded-xl px-5 text-base lowercase transition-all duration-300 placeholder:lowercase focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: "var(--bg-dark)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "var(--text-white)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent-primary)";
                      e.currentTarget.style.boxShadow = "0 0 0 2px var(--accent-glow)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    required
                    autoFocus
                    disabled={isPending}
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm lowercase"
                    style={{ color: "#ef4444" }}
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending || !topic.trim()}
                className="btn-accent w-full disabled:cursor-not-allowed disabled:opacity-50"
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
                    continue
                    <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div
                className="h-px flex-1"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              />
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                what you&apos;ll get
              </span>
              <div
                className="h-px flex-1"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              />
            </div>

            {/* Features */}
            <div className="grid gap-4 sm:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="card-dark group flex flex-col items-center p-4 text-center"
                >
                  <div className="icon-box mb-3">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3
                    className="text-sm font-medium lowercase"
                    style={{ color: "var(--text-white)" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-xs lowercase" style={{ color: "var(--text-gray)" }}>
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
            <p className="text-sm lowercase" style={{ color: "var(--text-muted)" }}>
              popular topics:{" "}
              <span style={{ color: "var(--text-gray)" }}>
                docker • kubernetes • react • postgresql • system design
              </span>
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
