import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { UserMenu } from "@/components/dashboard/user-menu";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | AI Learning Lab",
    default: "Dashboard | AI Learning Lab",
  },
  description: "Your personalized learning dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.03),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.03),transparent_50%)]" />

      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Navigation Header */}
      <header
        className="sticky top-0 z-50 w-full border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl"
        role="banner"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard/today"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
              data-testid="dashboard-logo"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-medium tracking-tight text-zinc-900">
                AI Learning Lab
              </span>
            </Link>

            {/* Primary Navigation */}
            <DashboardNav />
          </div>

          {/* User Menu */}
          <UserMenu user={session.user} />
        </div>
      </header>

      {/* Loading Indicator */}
      <DashboardLoading />

      {/* Main Content Area */}
      <main id="main-content" className="relative flex-1" role="main">
        {children}
      </main>
    </div>
  );
}
