"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AccessibilityToolbar } from "@/components/accessibility/AccessibilityToolbar";
import { Logo } from "@/components/brand";
import {
  HeroVisual,
  Stats,
  HowItWorks,
  Testimonials,
  SocialProof,
} from "@/components/landing";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function LandingPage() {
  // Initialize scroll reveal for .reveal elements
  useScrollReveal();

  return (
    <div className="landing-page">
      {/* Background effects */}
      <div className="noise-overlay decorative-bg" data-decorative="true" />
      <div className="hero-gradient hero-glow" data-decorative="true" />

      {/* Skip to main content - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        style={{
          backgroundColor: "var(--accent-primary)",
          color: "var(--bg-dark)",
        }}
      >
        skip to main content
      </a>

      {/* Header */}
      <header className="relative">
        <div
          className="container mx-auto flex items-center justify-between px-6"
          style={{ height: "var(--space-10)" }}
        >
          {/* Logo */}
          <Link href="/" className="animate-fade-in-up">
            <Logo size="lg" />
          </Link>

          {/* Nav */}
          <div className="flex items-center gap-4 animate-fade-in-up animate-delay-1">
            <AccessibilityToolbar />
            <Link href="/login" className="btn-outline">
              sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="relative">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-[var(--space-16)] lg:py-[var(--space-20)]">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              {/* Eyebrow */}
              <div className="animate-fade-in-up">
                <span className="text-eyebrow">
                  for engineers who ship
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-hero mt-6 animate-fade-in-up animate-delay-1">
                master any skill.{" "}
                <span style={{ color: "var(--text-muted)" }}>
                  ten minutes a day.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-body-lg mt-6 max-w-xl mx-auto lg:mx-0 animate-fade-in-up animate-delay-2">
                personalized learning paths. daily micro-lessons. real retention.
                no fluff, no overwhelm—just consistent progress.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-10 animate-fade-in-up animate-delay-3">
                <Link href="/login" className="btn-primary">
                  start learning free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="#how-it-works" className="btn-ghost">
                  see how it works
                </Link>
              </div>

              {/* Trust signal */}
              <p className="text-muted-sm mt-8 animate-fade-in-up animate-delay-4">
                join 1,000+ engineers learning daily
              </p>
            </div>

            {/* Hero Visual */}
            <div className="hidden lg:block animate-fade-in-up animate-delay-2">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* Social Proof - Company Logos */}
        <SocialProof />

        {/* Stats Section */}
        <Stats />

        {/* How It Works Section */}
        <section id="how-it-works">
          <HowItWorks />
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* Final CTA Section */}
        <section className="container mx-auto px-6 py-[var(--space-20)]">
          <div className="card-featured max-w-3xl mx-auto text-center reveal">
            <h2 className="text-section-title mb-4">
              your learning journey starts now.
            </h2>
            <p className="text-body max-w-md mx-auto mb-8">
              join thousands of engineers who've transformed how they learn.
              start with a free personalized learning path.
            </p>
            <Link href="/login" className="btn-accent">
              start learning free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-muted-sm mt-6">
              no credit card required. cancel anytime.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="relative border-t"
        style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
      >
        <div
          className="container mx-auto px-6"
          style={{ paddingTop: "var(--space-6)", paddingBottom: "var(--space-6)" }}
        >
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Logo */}
            <Link href="/">
              <Logo size="md" />
            </Link>

            {/* Nav Links */}
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm lowercase">
              <Link href="/about" className="link-muted">
                about
              </Link>
              <Link href="/privacy" className="link-muted">
                privacy
              </Link>
              <Link href="/terms" className="link-muted">
                terms
              </Link>
              <Link href="/contact" className="link-muted">
                contact
              </Link>
            </nav>

            {/* Copyright */}
            <p className="text-muted-sm">built with claude code © 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
