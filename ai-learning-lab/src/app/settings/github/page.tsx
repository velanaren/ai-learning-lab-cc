import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Github, Settings } from "lucide-react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { decryptToken } from "@/lib/github/encryption";
import { GitHubClient } from "@/lib/github/client";
import { RepositorySelector } from "./RepositorySelector";
import { ConnectGitHubButton } from "./ConnectGitHubButton";
import { DisconnectGitHubButton } from "./DisconnectGitHubButton";

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
      <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 text-center shadow-xl shadow-zinc-200/30">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
          <Github className="h-8 w-8 text-zinc-400" />
        </div>
        <h3 className="text-xl font-medium text-zinc-900">Connect GitHub</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
          Connect your GitHub account to import commits and pull requests as evidence of your learning.
          Your code contributions become verifiable proof of progress.
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
    fetchError = "Failed to fetch repositories. Your GitHub connection may have expired.";
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between rounded-2xl border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
            <Github className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-green-900">GitHub Connected</p>
            <p className="text-sm text-green-700">
              Connected {new Date(user.githubConn.connectedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <DisconnectGitHubButton />
      </div>

      {/* Repository Selector */}
      {fetchError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-700">{fetchError}</p>
          <div className="mt-4">
            <ConnectGitHubButton label="Reconnect GitHub" />
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
      <div className="h-20 animate-pulse rounded-2xl bg-zinc-100" />
      <div className="h-96 animate-pulse rounded-3xl bg-zinc-100" />
    </div>
  );
}

export default async function GitHubSettingsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

      {/* Content */}
      <div className="relative py-8 sm:py-12">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                Settings
              </span>
            </div>
            <h1 className="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
              GitHub Integration
            </h1>
            <p className="mt-2 text-base leading-relaxed text-zinc-500">
              Connect your GitHub account and select repositories to track for evidence
            </p>
          </div>

          {/* Status Messages */}
          {params.error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">
                {params.error === "oauth_error"
                  ? "GitHub authorization was cancelled or failed."
                  : params.error === "invalid_state"
                  ? "Security validation failed. Please try again."
                  : params.error === "token_exchange"
                  ? "Failed to complete GitHub connection. Please try again."
                  : "An error occurred. Please try again."}
              </p>
            </div>
          )}

          {params.success === "connected" && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-700">
                GitHub connected successfully! Select the repositories you want to track below.
              </p>
            </div>
          )}

          {/* Content */}
          <Suspense fallback={<LoadingSkeleton />}>
            <GitHubSettingsContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
