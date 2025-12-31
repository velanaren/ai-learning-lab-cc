"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-xl shadow-red-100/50 text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-medium tracking-tight text-zinc-900">
              Something went wrong
            </h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-500">
              We encountered an error loading your dashboard. This might be a
              temporary issue.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={reset}
                className="group h-14 rounded-2xl bg-zinc-900 px-8 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25"
                data-testid="error-retry-button"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                Try Again
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  className="h-14 w-full rounded-2xl border-2 border-zinc-200 px-8 text-base font-medium transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 sm:w-auto"
                  data-testid="error-home-button"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Go Home
                </Button>
              </Link>
            </div>

            {process.env.NODE_ENV === "development" && error.message && (
              <div className="mt-6 rounded-xl bg-zinc-50 p-4 text-left">
                <p className="text-xs font-medium text-zinc-500 mb-1">
                  Error Details (dev only):
                </p>
                <p className="text-sm text-zinc-600 font-mono break-all">
                  {error.message}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
