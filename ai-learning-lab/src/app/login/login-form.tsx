"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand";
import { AccessibilityToolbar } from "@/components/accessibility/AccessibilityToolbar";

interface LoginFormProps {
  isGoogleConfigured: boolean;
  isGitHubConfigured: boolean;
}

export default function LoginForm({
  isGoogleConfigured,
  isGitHubConfigured,
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (providerName: "google" | "github") => {
    try {
      setIsLoading(true);
      setProvider(providerName);
      setError(null);

      const result = await signIn(providerName, {
        callbackUrl: "/onboarding",
        redirect: false,
      });

      if (result?.error) {
        setError(
          result.error === "OAuthAccountNotLinked"
            ? "this email is already associated with another provider. please use that provider to sign in."
            : "failed to sign in. please try again."
        );
        setIsLoading(false);
        setProvider(null);
      } else if (result?.ok) {
        window.location.href = result.url || "/onboarding";
      }
    } catch (err) {
      setError(
        "an unexpected error occurred. please check your connection and try again."
      );
      setIsLoading(false);
      setProvider(null);
    }
  };

  return (
    <div className="landing-page">
      {/* Background effects */}
      <div className="noise-overlay decorative-bg" data-decorative="true" />
      <div className="hero-gradient hero-glow" data-decorative="true" />

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
          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="btn-outline group animate-fade-in-up"
              data-testid="back-to-home"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              back to home
            </Link>
          </motion.div>

          {/* Accessibility */}
          <div className="animate-fade-in-up animate-delay-1">
            <AccessibilityToolbar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        className="relative flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <Logo size="lg" />
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="card-featured"
          >
            <div className="mb-8 text-center">
              <h1 className="text-section-title">welcome back</h1>
              <p className="text-body mt-2">
                sign in to continue your learning journey
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl p-4 text-sm lowercase"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                }}
                role="alert"
                data-testid="error-message"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              {/* Google Sign In */}
              {isGoogleConfigured && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSignIn("google");
                  }}
                  aria-label="Sign in with Google"
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border font-medium lowercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      backgroundColor: "var(--bg-dark)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      color: "var(--text-white)",
                    }}
                    onMouseOver={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.borderColor = "var(--accent-primary)";
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    }}
                    data-testid="google-login-button"
                  >
                    {isLoading && provider === "google" ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                          }}
                          className="h-5 w-5 rounded-full border-2"
                          style={{
                            borderColor: "var(--text-muted)",
                            borderTopColor: "var(--accent-primary)",
                          }}
                        />
                        signing in...
                      </span>
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        continue with google
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Divider */}
              {isGoogleConfigured && isGitHubConfigured && (
                <div className="relative py-2" aria-hidden="true">
                  <div className="absolute inset-0 flex items-center">
                    <span
                      className="w-full border-t"
                      style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                    />
                  </div>
                  <div className="relative flex justify-center">
                    <span
                      className="px-4 text-sm lowercase"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-muted)",
                      }}
                    >
                      or
                    </span>
                  </div>
                </div>
              )}

              {/* GitHub Sign In */}
              {isGitHubConfigured && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSignIn("github");
                  }}
                  aria-label="Sign in with GitHub"
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border font-medium lowercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      backgroundColor: "var(--bg-dark)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      color: "var(--text-white)",
                    }}
                    onMouseOver={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.borderColor = "var(--accent-primary)";
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                    }}
                    data-testid="github-login-button"
                  >
                    {isLoading && provider === "github" ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                          }}
                          className="h-5 w-5 rounded-full border-2"
                          style={{
                            borderColor: "var(--text-muted)",
                            borderTopColor: "var(--accent-primary)",
                          }}
                        />
                        signing in...
                      </span>
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        continue with github
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Terms */}
            <p className="mt-8 text-center text-sm lowercase" style={{ color: "var(--text-muted)" }}>
              by continuing, you agree to our{" "}
              <Link
                href="/terms"
                className="transition-colors hover:text-[var(--accent-primary)]"
                style={{ color: "var(--text-gray)" }}
              >
                terms of service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="transition-colors hover:text-[var(--accent-primary)]"
                style={{ color: "var(--text-gray)" }}
              >
                privacy policy
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
