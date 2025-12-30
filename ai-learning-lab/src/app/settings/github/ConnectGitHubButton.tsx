"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

interface ConnectGitHubButtonProps {
  label?: string;
}

export function ConnectGitHubButton({ label = "Connect GitHub" }: ConnectGitHubButtonProps) {
  return (
    <Button
      asChild
      className="group h-14 rounded-2xl bg-zinc-900 px-8 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25"
    >
      <a href="/api/github/connect" className="flex items-center gap-2">
        <Github className="h-5 w-5" />
        {label}
      </a>
    </Button>
  );
}
