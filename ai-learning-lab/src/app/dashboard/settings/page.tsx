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
      className="group flex items-center gap-4 rounded-2xl border-2 border-zinc-200 bg-white p-4 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 transition-colors group-hover:bg-zinc-200">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-zinc-900">{title}</h3>
          {badge && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
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
    <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
          <Icon className="h-6 w-6 text-zinc-600" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-zinc-900">{title}</h2>
          <p className="mt-0.5 text-sm text-zinc-500">{description}</p>
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

      <div className="relative py-8 sm:py-12">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2">
              <Sliders className="h-4 w-4 text-zinc-600" />
              <span className="text-sm font-medium text-zinc-600">
                Preferences
              </span>
            </div>
            <h1 className="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
              Settings
            </h1>
            <p className="mt-2 text-base leading-relaxed text-zinc-500">
              Customize your learning experience
            </p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Learning Preferences */}
            <AnimatedSection delay={0}>
              <SettingsSection
                icon={Clock}
                title="Learning Preferences"
                description="Set your time budget and pacing preferences"
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
                title="Accessibility"
                description="Customize how content is presented to you"
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
                title="Application & Evidence"
                description="Configure how you practice and track progress"
              >
                <ApplicationSettingsForm
                  initialApplicationFrequency={applicationFrequency}
                  initialTrackingPreference={trackingPreference}
                />
              </SettingsSection>
            </AnimatedSection>

            {/* Integrations */}
            <AnimatedSection delay={0.3}>
              <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30">
                <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
                  Integrations
                </h2>
                <div className="space-y-3">
                  <SettingsLink
                    href="/settings/github"
                    icon={<Github className="h-6 w-6 text-zinc-600" />}
                    title="GitHub"
                    description={
                      githubConnected
                        ? "Connected - Manage your repositories"
                        : "Connect to import commits and PRs as evidence"
                    }
                    badge={githubConnected ? "Connected" : undefined}
                  />
                </div>
              </div>
            </AnimatedSection>

            {/* Account */}
            <AnimatedSection delay={0.4}>
              <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30">
                <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
                  Account
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-200">
                      <User className="h-6 w-6 text-zinc-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-zinc-900">
                        {user.name || "User"}
                      </h3>
                      <p className="mt-0.5 text-sm text-zinc-500">
                        Signed in with Google
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-200">
                      <Mail className="h-6 w-6 text-zinc-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-zinc-900">Email</h3>
                      <p className="mt-0.5 text-sm text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
