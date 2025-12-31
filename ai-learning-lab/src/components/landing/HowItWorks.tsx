"use client";

import { MessageSquare, Route, Zap, Trophy } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: MessageSquare,
    title: "tell us about you",
    description:
      "answer a few questions about your background, goals, and how much time you have. takes 2 minutes.",
  },
  {
    number: 2,
    icon: Route,
    title: "get your path",
    description:
      "our ai builds a personalized learning sequence. no generic courses—every concept is chosen for you.",
  },
  {
    number: 3,
    icon: Zap,
    title: "learn daily",
    description:
      "one focused concept per day. 10-30 minutes of deep learning, reflection, and hands-on practice.",
  },
  {
    number: 4,
    icon: Trophy,
    title: "build proof",
    description:
      "track your progress. build a memory of everything you've learned. proof you can show.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-[var(--space-20)]">
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-eyebrow mb-4 inline-block">how it works</span>
          <h2 className="text-section-title">four steps to mastery</h2>
        </div>

        {/* Steps grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative reveal"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {/* Connector line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-6 left-[calc(50%+24px)] w-[calc(100%-48px)] h-[1px]"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                />
              )}

              {/* Step content */}
              <div className="text-center">
                {/* Step number */}
                <div className="flex justify-center mb-4">
                  <div className="step-number">{step.number}</div>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="icon-box">
                    <step.icon />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-card-title mb-2">{step.title}</h3>

                {/* Description */}
                <p className="text-body text-sm" style={{ fontSize: "calc(14px * var(--font-size-base))" }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
