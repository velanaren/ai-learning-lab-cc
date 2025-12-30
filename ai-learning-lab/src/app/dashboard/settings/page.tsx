import Link from "next/link";
import { Github, Sliders, ChevronRight, Sparkles, User, Bell } from "lucide-react";
import type { Metadata } from "next";

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

function SettingsLink({ href, icon, title, description, badge }: SettingsLinkProps) {
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

function ComingSoonCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-4 opacity-60">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-zinc-600">{title}</h3>
          <span className="flex items-center gap-1 rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-500">
            <Sparkles className="h-3 w-3" />
            Soon
          </span>
        </div>
        <p className="mt-0.5 text-sm text-zinc-400">{description}</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
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
              Manage your account and learning preferences
            </p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-4">
            {/* Integrations Section */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
                Integrations
              </h2>
              <div className="space-y-3">
                <SettingsLink
                  href="/settings/github"
                  icon={<Github className="h-6 w-6 text-zinc-600" />}
                  title="GitHub"
                  description="Connect your GitHub account to import commits and PRs as evidence"
                  badge="New"
                />
              </div>
            </div>

            {/* Account Section */}
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30">
              <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
                Account
              </h2>
              <div className="space-y-3">
                <ComingSoonCard
                  icon={<User className="h-6 w-6 text-zinc-400" />}
                  title="Profile"
                  description="Update your name, email, and profile picture"
                />
                <ComingSoonCard
                  icon={<Bell className="h-6 w-6 text-zinc-400" />}
                  title="Notifications"
                  description="Configure email and push notification preferences"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
