import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import LoginForm from "./login-form";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | AI Learning Lab",
  description: "Sign in to AI Learning Lab with Google or GitHub to start your personalized learning journey.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  // Edge Case 1: Redirect if already logged in
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  // Edge Case 2: Check OAuth configuration
  const isGoogleConfigured = !!(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
  const isGitHubConfigured = !!(
    process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
  );

  if (!isGoogleConfigured && !isGitHubConfigured) {
    return (
      <div className="landing-page">
        {/* Background effects */}
        <div className="noise-overlay decorative-bg" data-decorative="true" />
        <div className="hero-gradient" data-decorative="true" />

        {/* Header */}
        <header className="relative">
          <div
            className="container mx-auto flex items-center justify-between px-6"
            style={{ height: "var(--space-10)" }}
          >
            <Link href="/" className="btn-outline group">
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              back to home
            </Link>
          </div>
        </header>

        {/* Error Content */}
        <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center">
              <Logo size="lg" />
            </div>
            <div
              className="card-dark text-center"
              style={{
                borderColor: "rgba(239, 68, 68, 0.3)",
              }}
            >
              <div
                className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl"
                style={{ backgroundColor: "rgba(239, 68, 68, 0.15)" }}
              >
                <AlertCircle className="h-7 w-7" style={{ color: "#ef4444" }} />
              </div>
              <h2 className="text-lg font-medium lowercase" style={{ color: "var(--text-white)" }}>
                authentication not configured
              </h2>
              <p className="mt-2 text-sm lowercase" style={{ color: "var(--text-gray)" }}>
                oauth providers are not configured. please contact support.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <LoginForm
      isGoogleConfigured={isGoogleConfigured}
      isGitHubConfigured={isGitHubConfigured}
    />
  );
}
