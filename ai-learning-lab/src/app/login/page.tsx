import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | AI Learning Lab",
  description: "Sign in to AI Learning Lab with Google or GitHub to start your personalized learning journey.",
  robots: {
    index: false, // Don't index login pages
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
      <div className="flex min-h-screen items-center justify-center bg-[#FBFBFC] px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-medium text-red-900">
            Authentication Not Configured
          </h2>
          <p className="mt-2 text-sm text-red-700">
            OAuth providers are not configured. Please contact support.
          </p>
        </div>
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
