"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Calendar, TrendingUp, Sparkles } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: Target,
      title: "Personalized for You",
      description:
        "Answer a few questions and get a learning path tailored to your background, goals, and daily time budget.",
    },
    {
      icon: Calendar,
      title: "One Concept Daily",
      description:
        "Short, focused sessions (10-30 min) that fit into real life. No overwhelming courses or endless videos.",
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description:
        "See what you've learned and what you've built. Memory and proof-of-work make progress visible.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

      {/* Skip to main content - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="relative">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-medium text-zinc-900">
              AI Learning Lab
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full border-2 border-zinc-200 px-6 text-sm font-medium transition-all duration-200 hover:border-zinc-900 hover:bg-zinc-50"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <main id="main-content" className="relative">
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2"
            >
              <span className="text-sm font-medium text-zinc-600">
                Your personalized learning companion
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-medium tracking-tight text-zinc-900 sm:text-5xl md:text-6xl"
            >
              Learn technical topics{" "}
              <span className="text-zinc-400">daily.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-500 sm:text-xl"
            >
              10-30 minute sessions. Tailored to you. No fluff.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Button
                asChild
                className="group h-14 rounded-2xl bg-zinc-900 px-8 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25"
              >
                <Link href="/login">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="h-14 rounded-2xl px-8 text-base font-medium text-zinc-600 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-900"
              >
                <Link href="#features">See How It Works</Link>
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 text-sm text-zinc-400"
            >
              Join learners building real skills daily
            </motion.p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 pb-24">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="group rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30 transition-all duration-300 hover:shadow-2xl hover:shadow-zinc-200/40"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 transition-colors duration-300 group-hover:bg-zinc-900">
                  <feature.icon className="h-6 w-6 text-zinc-600 transition-colors duration-300 group-hover:text-white" />
                </div>
                <h3 className="text-lg font-medium text-zinc-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-zinc-200/60 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-zinc-900">
                AI Learning Lab
              </span>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link
                href="/about"
                className="text-zinc-500 transition-colors hover:text-zinc-900"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="text-zinc-500 transition-colors hover:text-zinc-900"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-zinc-500 transition-colors hover:text-zinc-900"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-zinc-500 transition-colors hover:text-zinc-900"
              >
                Contact
              </Link>
            </nav>

            <p className="text-sm text-zinc-400">
              Built with Claude Code © 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
