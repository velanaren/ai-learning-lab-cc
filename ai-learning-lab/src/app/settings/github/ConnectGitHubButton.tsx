"use client";

import { Github } from "lucide-react";

interface ConnectGitHubButtonProps {
  label?: string;
}

export function ConnectGitHubButton({ label = "connect github" }: ConnectGitHubButtonProps) {
  return (
    <a
      href="/api/github/connect"
      className="btn-accent inline-flex"
    >
      <Github className="h-5 w-5" />
      {label}
    </a>
  );
}
