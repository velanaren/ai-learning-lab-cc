import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Github,
  Sliders,
  ChevronRight,
  Clock,
  Eye,
  Zap,
  User,
  Mail,
} from "lucide-react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { LearningPreferencesForm } from "@/components/settings/LearningPreferencesForm";
import { AccessibilityForm } from "@/components/settings/AccessibilityForm";
import { ApplicationSettingsForm } from "@/components/settings/ApplicationSettingsForm";
import { AnimatedSection } from "@/components/settings/AnimatedSection";

export const metadata: Metadata = {
  title: "Settings | AI Learning Lab",
  description: "Manage your learning preferences and account settings",
};

interface SettingsLinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

function SettingsLink({
  href,
  icon,
  title,
  description,
  badge,
}: SettingsLinkProps) {
  return (
    <Link
      href={href}
      className="card-dark group flex items-center gap-4 p-4 transition-all duration-300"
    >
      <div className="icon-box flex-shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className="font-medium lowercase"
            style={{ color: "var(--text-white)" }}
          >
            {title}
          </h3>
          {badge && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium lowercase"
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.15)",
                color: "#22c55e",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm lowercase" style={{ color: "var(--text-gray)" }}>
          {description}
        </p>
      </div>
      <ChevronRight
        className="h-5 w-5 flex-shrink-0 transition-transform group-hover:translate-x-0.5"
        style={{ color: "var(--text-muted)" }}
      />
    </Link>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-elevated">
      <div className="mb-6 flex items-start gap-4">
        <div className="icon-box flex-shrink-0">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-medium lowercase" style={{ color: "var(--text-white)" }}>
            {title}
          </h2>
          <p className="mt-0.5 text-sm lowercase" style={{ color: "var(--text-gray)" }}>
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      profile: true,
      githubConn: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const profile = user.profile;
  const githubConnected = !!user.githubConn;

  // Derive pacing preference from missedDayBehavior
  const pacingPreference: "auto" | "ask" =
    profile?.missedDayBehavior === "ask before adjusting" ? "ask" : "auto";

  // Derive application frequency from proofOfWorkImportance
  const applicationFrequency: "low" | "some" | "high" =
    profile?.proofOfWorkImportance === "very important"
      ? "high"
      : profile?.proofOfWorkImportance === "important"
        ? "some"
        : "low";

  // Derive tracking preference
  const trackingPreference: "learning-only" | "with-applications" | "with-evidence" =
    (profile?.trackingPreference as "learning-only" | "with-applications" | "with-evidence") ||
    "learning-only";

  // Derive content order
  const contentOrder: "tldr-first" | "details-first" | "example-first" =
    (profile?.contentOrder as "tldr-first" | "details-first" | "example-first") ||
    "tldr-first";

  return (
    <div className="relative" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-12)" }}>
      {/* Hero gradient */}
      <div className="hero-gradient" data-decorative="true" style={{ opacity: 0.1 }} />

      <div className="container mx-auto max-w-3xl px-6">
        {/* Header */}
        <div className="mb-10 animate-fade-in-up">
          <div className="mb-4 flex items-center gap-3">
            <div className="icon-box">
              <Sliders className="h-6 w-6" />
            </div>
            <span className="text-eyebrow">preferences</span>
          </div>
          <h1 className="text-section-title">settings</h1>
          <p className="text-body mt-2">
            customize your learning experience
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Learning Preferences */}
          <AnimatedSection delay={0}>
            <SettingsSection
              icon={Clock}
              title="learning preferences"
              description="set your time budget and pacing preferences"
            >
              <LearningPreferencesForm
                initialDailyMinutes={profile?.dailyMinutes || 20}
                initialWeeklyHours={profile?.weeklyHours || 5}
                initialPacingPreference={pacingPreference}
              />
            </SettingsSection>
          </AnimatedSection>

          {/* Accessibility */}
          <AnimatedSection delay={0.1}>
            <SettingsSection
              icon={Eye}
              title="accessibility"
              description="customize how content is presented to you"
            >
              <AccessibilityForm
                initialPreferredFormats={profile?.preferredFormats || []}
                initialContentOrder={contentOrder}
                initialUiToggles={profile?.uiToggles || []}
              />
            </SettingsSection>
          </AnimatedSection>

          {/* Application Settings */}
          <AnimatedSection delay={0.2}>
            <SettingsSection
              icon={Zap}
              title="application & evidence"
              description="configure how you practice and track progress"
            >
              <ApplicationSettingsForm
                initialApplicationFrequency={applicationFrequency}
                initialTrackingPreference={trackingPreference}
              />
            </SettingsSection>
          </AnimatedSection>

          {/* Integrations */}
          <AnimatedSection delay={0.3}>
            <div className="card-elevated">
              <h2
                className="mb-4 text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                integrations
              </h2>
              <div className="space-y-3">
                <SettingsLink
                  href="/settings/github"
                  icon={<Github className="h-6 w-6" style={{ color: "var(--accent-primary)" }} />}
                  title="github"
                  description={
                    githubConnected
                      ? "connected - manage your repositories"
                      : "connect to import commits and prs as evidence"
                  }
                  badge={githubConnected ? "connected" : undefined}
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Account */}
          <AnimatedSection delay={0.4}>
            <div className="card-elevated">
              <h2
                className="mb-4 text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                account
              </h2>
              <div className="space-y-4">
                <div
                  className="flex items-center gap-4 rounded-xl p-4"
                  style={{
                    backgroundColor: "var(--bg-dark)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div className="icon-box flex-shrink-0">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium lowercase" style={{ color: "var(--text-white)" }}>
                      {user.name?.toLowerCase() || "user"}
                    </h3>
                    <p className="mt-0.5 text-sm lowercase" style={{ color: "var(--text-gray)" }}>
                      signed in with google
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-4 rounded-xl p-4"
                  style={{
                    backgroundColor: "var(--bg-dark)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div className="icon-box flex-shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium lowercase" style={{ color: "var(--text-white)" }}>
                      email
                    </h3>
                    <p className="mt-0.5 text-sm lowercase" style={{ color: "var(--text-gray)" }}>
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
