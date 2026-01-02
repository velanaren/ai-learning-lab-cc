import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Github, Settings, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { decryptToken } from "@/lib/github/encryption";
import { GitHubClient } from "@/lib/github/client";
import { RepositorySelector } from "./RepositorySelector";
import { ConnectGitHubButton } from "./ConnectGitHubButton";
import { DisconnectGitHubButton } from "./DisconnectGitHubButton";
import { Logo } from "@/components/brand";
import { AccessibilityToolbar } from "@/components/accessibility/AccessibilityToolbar";

export const metadata: Metadata = {
  title: "GitHub Settings | AI Learning Lab",
  description: "Connect your GitHub account to import evidence",
};

interface PageProps {
  searchParams: Promise<{ error?: string; success?: string }>;
}

async function GitHubSettingsContent() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { githubConn: true },
  });

  if (!user) {
    redirect("/login");
  }

  // If not connected, show connect button
  if (!user.githubConn) {
    return (
      <div className="card-featured text-center">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "var(--bg-dark)" }}
        >
          <Github className="h-8 w-8" style={{ color: "var(--text-muted)" }} />
        </div>
        <h3 className="text-xl font-medium lowercase" style={{ color: "var(--text-white)" }}>
          connect github
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed lowercase" style={{ color: "var(--text-gray)" }}>
          connect your github account to import commits and pull requests as evidence of your learning.
          your code contributions become verifiable proof of progress.
        </p>
        <div className="mt-6">
          <ConnectGitHubButton />
        </div>
      </div>
    );
  }

  // Fetch repositories
  let repos: Awaited<ReturnType<typeof GitHubClient.prototype.listRepos>> = [];
  let fetchError: string | null = null;

  try {
    const token = decryptToken(user.githubConn.accessToken);
    const client = new GitHubClient(token);
    repos = await client.listRepos();
  } catch (error) {
    console.error("Error fetching repos:", error);
    fetchError = "failed to fetch repositories. your github connection may have expired.";
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div
        className="flex items-center justify-between rounded-xl p-4"
        style={{
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          border: "1px solid rgba(34, 197, 94, 0.2)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(34, 197, 94, 0.15)" }}
          >
            <Github className="h-5 w-5" style={{ color: "#22c55e" }} />
          </div>
          <div>
            <p className="font-medium lowercase" style={{ color: "#22c55e" }}>
              github connected
            </p>
            <p className="text-sm lowercase" style={{ color: "rgba(34, 197, 94, 0.8)" }}>
              connected {new Date(user.githubConn.connectedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <DisconnectGitHubButton />
      </div>

      {/* Repository Selector */}
      {fetchError ? (
        <div
          className="rounded-xl p-6 text-center"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <p className="lowercase" style={{ color: "#ef4444" }}>{fetchError}</p>
          <div className="mt-4">
            <ConnectGitHubButton label="reconnect github" />
          </div>
        </div>
      ) : (
        <RepositorySelector
          repos={repos}
          initialSelectedRepos={user.githubConn.selectedRepos}
        />
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-20 rounded-xl" />
      <div className="skeleton h-96 rounded-xl" />
    </div>
  );
}

export default async function GitHubSettingsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="landing-page">
      {/* Background effects */}
      <div className="noise-overlay decorative-bg" data-decorative="true" />
      <div className="hero-gradient" data-decorative="true" style={{ opacity: 0.3 }} />

      {/* Skip link */}
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
          <Link
            href="/dashboard/settings"
            className="btn-outline group animate-fade-in-up"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            back to settings
          </Link>
          <div className="animate-fade-in-up animate-delay-1">
            <AccessibilityToolbar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        className="relative"
        style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-12)" }}
      >
        <div className="container mx-auto max-w-3xl px-6">
          {/* Header */}
          <div className="mb-10 animate-fade-in-up">
            <div className="mb-4 flex items-center gap-3">
              <div className="icon-box">
                <Github className="h-6 w-6" />
              </div>
              <span className="text-eyebrow">integration</span>
            </div>
            <h1 className="text-section-title">github integration</h1>
            <p className="text-body mt-2">
              connect your github account and select repositories to track for evidence
            </p>
          </div>

          {/* Status Messages */}
          {params.error && (
            <div
              className="mb-6 rounded-xl p-4 animate-fade-in-up"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <p className="text-sm lowercase" style={{ color: "#ef4444" }}>
                {params.error === "oauth_error"
                  ? "github authorization was cancelled or failed."
                  : params.error === "invalid_state"
                  ? "security validation failed. please try again."
                  : params.error === "token_exchange"
                  ? "failed to complete github connection. please try again."
                  : "an error occurred. please try again."}
              </p>
            </div>
          )}

          {params.success === "connected" && (
            <div
              className="mb-6 rounded-xl p-4 animate-fade-in-up"
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.2)",
              }}
            >
              <p className="text-sm lowercase" style={{ color: "#22c55e" }}>
                github connected successfully! select the repositories you want to track below.
              </p>
            </div>
          )}

          {/* Content */}
          <div className="animate-fade-in-up animate-delay-1">
            <Suspense fallback={<LoadingSkeleton />}>
              <GitHubSettingsContent />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
