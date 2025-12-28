"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#FBFBFC] px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-medium text-zinc-900">
          Something went wrong
        </h1>

        <p className="mb-6 text-base text-zinc-600">
          We encountered an error loading your dashboard. This has been logged
          and we'll look into it.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            className="group rounded-full px-6 py-6 text-base font-medium shadow-sm transition-all hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
            data-testid="error-retry-button"
          >
            <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
            Try Again
          </Button>

          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/")}
            className="rounded-full px-6 py-6 text-base font-medium transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
            data-testid="error-home-button"
          >
            Back to Home
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-4 text-left">
            <p className="text-xs font-medium text-zinc-900">
              Error Details (dev only):
            </p>
            <p className="mt-2 text-xs text-zinc-600 font-mono break-words">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
