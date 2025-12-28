import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Calendar, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBFC]">
      {/* Skip to main content - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
      >
        Skip to main content
      </a>

      {/* Hero Section */}
      <main id="main-content" className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center gap-6 px-6 py-12 md:py-16">
          <div className="flex max-w-[56rem] flex-col items-center gap-5 text-center">
            {/* Headline with improved rhythm and animation */}
            <h1 className="animate-in fade-in slide-in-from-bottom-4 text-3xl font-medium leading-[1.2] tracking-tight text-zinc-900 duration-700 sm:text-4xl md:text-5xl lg:text-6xl">
              Learn technical topics{" "}
              <span className="text-zinc-500">daily.</span>
            </h1>

            {/* Stronger subheadline */}
            <p className="animate-in fade-in slide-in-from-bottom-5 max-w-[40rem] text-base leading-relaxed text-zinc-600 duration-700 delay-100 sm:text-lg md:text-xl">
              10-30 minute sessions. Tailored to you. No fluff.
            </p>

            {/* Social proof */}
            <div className="animate-in fade-in slide-in-from-bottom-6 text-sm text-zinc-500 duration-700 delay-150">
              Join learners building real skills daily
            </div>

            {/* Primary and Secondary CTAs */}
            <div className="animate-in fade-in slide-in-from-bottom-7 mt-2 flex flex-col gap-3 duration-700 delay-200 sm:flex-row sm:gap-4">
              <Button
                asChild
                size="lg"
                className="group rounded-full px-9 py-6 text-base font-medium shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              >
                <Link href="/login">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="rounded-full px-9 py-6 text-base font-medium text-zinc-700 transition-all hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              >
                <Link href="#features">See How It Works</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section with Cards and Icons */}
        <section id="features" className="container mx-auto px-6 pb-16">
          <div className="mx-auto grid max-w-6xl gap-6 md:gap-8 md:grid-cols-3">
            {/* Feature 1 - Personalized */}
            <div className="group animate-in fade-in slide-in-from-bottom-8 flex flex-col gap-4 rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md delay-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                <Target className="h-5 w-5 text-zinc-700 group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium text-zinc-900">
                  Personalized for You
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Answer a few questions and get a learning path tailored to your background,
                  goals, and daily time budget.
                </p>
              </div>
            </div>

            {/* Feature 2 - One Concept Daily */}
            <div className="group animate-in fade-in slide-in-from-bottom-9 flex flex-col gap-4 rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md delay-400">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                <Calendar className="h-5 w-5 text-zinc-700 group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium text-zinc-900">
                  One Concept Daily
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Short, focused sessions (10-30 min) that fit into real life.
                  No overwhelming courses or endless videos.
                </p>
              </div>
            </div>

            {/* Feature 3 - Track Progress */}
            <div className="group animate-in fade-in slide-in-from-bottom-10 flex flex-col gap-4 rounded-2xl border border-zinc-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md delay-500">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                <TrendingUp className="h-5 w-5 text-zinc-700 group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium text-zinc-900">
                  Track Your Progress
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  See what you've learned and what you've built. Memory and proof-of-work
                  make progress visible.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="border-t border-zinc-200/60 bg-white/70" role="contentinfo">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
            {/* Brand */}
            <div className="flex flex-col items-center gap-2 md:items-start">
              <span className="text-base font-medium text-zinc-900">AI Learning Lab</span>
              <p className="text-sm text-zinc-500">
                Built with Claude Code © 2025
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-wrap items-center justify-center gap-8 text-sm" aria-label="Footer navigation">
              <Link
                href="/about"
                className="text-zinc-600 transition-colors hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="text-zinc-600 transition-colors hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-zinc-600 transition-colors hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-zinc-600 transition-colors hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
