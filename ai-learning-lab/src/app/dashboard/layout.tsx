import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { UserMenu } from "@/components/dashboard/user-menu";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { DashboardClientWrapper, AccessibilityToolbar } from "@/components/dashboard/DashboardClientWrapper";
import { Logo } from "@/components/brand";
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
    <DashboardClientWrapper>
      <div className="landing-page">
        {/* Background effects */}
        <div className="noise-overlay decorative-bg" data-decorative="true" />

        {/* Skip to main content link for accessibility */}
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

        {/* Navigation Header */}
        <header
          className="sticky top-0 z-50 w-full border-b"
          style={{
            borderColor: "rgba(255, 255, 255, 0.06)",
            backgroundColor: "rgba(13, 13, 13, 0.8)",
            backdropFilter: "blur(12px)",
          }}
          role="banner"
        >
          <div
            className="container mx-auto flex items-center justify-between px-6"
            style={{ height: "var(--space-10)" }}
          >
            {/* Logo & Brand */}
            <div className="flex items-center gap-8">
              <Link
                href="/dashboard"
                className="transition-opacity hover:opacity-80 animate-fade-in-up"
                data-testid="dashboard-logo"
              >
                <Logo size="md" />
              </Link>

              {/* Primary Navigation */}
              <DashboardNav />
            </div>

            {/* Right side: Accessibility & User Menu */}
            <div className="flex items-center gap-4 animate-fade-in-up animate-delay-1">
              <AccessibilityToolbar />
              <UserMenu user={session.user} />
            </div>
          </div>
        </header>

        {/* Loading Indicator */}
        <DashboardLoading />

        {/* Main Content Area */}
        <main id="main-content" className="relative flex-1" role="main">
          {children}
        </main>
      </div>
    </DashboardClientWrapper>
  );
}
