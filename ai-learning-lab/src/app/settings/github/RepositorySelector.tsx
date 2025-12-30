"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  Search,
  Loader2,
  Lock,
  Globe,
  GitBranch,
  CheckCircle2,
} from "lucide-react";
import type { GitHubRepo } from "@/lib/github/client";

interface RepositorySelectorProps {
  repos: GitHubRepo[];
  initialSelectedRepos: string[];
}

export function RepositorySelector({
  repos,
  initialSelectedRepos,
}: RepositorySelectorProps) {
  const [selectedRepos, setSelectedRepos] = useState<string[]>(initialSelectedRepos);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredRepos = useMemo(() => {
    if (!searchQuery.trim()) return repos;
    const query = searchQuery.toLowerCase();
    return repos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        repo.fullName.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query)
    );
  }, [repos, searchQuery]);

  const toggleRepo = (fullName: string) => {
    setSaveSuccess(false);
    setSelectedRepos((prev) =>
      prev.includes(fullName)
        ? prev.filter((r) => r !== fullName)
        : [...prev, fullName]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/github/repos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedRepos }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    JSON.stringify(selectedRepos.sort()) !==
    JSON.stringify(initialSelectedRepos.sort());

  return (
    <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30 sm:p-8">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-zinc-900">Select Repositories</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Choose which repositories you want to track. Commits and pull requests from
          selected repos can be imported as evidence.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 rounded-xl border-zinc-200 pl-10 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10"
        />
      </div>

      {/* Repository List */}
      <div className="max-h-96 space-y-2 overflow-y-auto">
        {filteredRepos.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-400">
            {searchQuery ? "No repositories match your search" : "No repositories found"}
          </p>
        ) : (
          filteredRepos.map((repo, index) => {
            const isSelected = selectedRepos.includes(repo.fullName);

            return (
              <motion.button
                key={repo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                onClick={() => toggleRepo(repo.fullName)}
                className={`flex w-full items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-zinc-900 bg-zinc-50"
                    : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                {/* Checkbox */}
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-zinc-900 bg-zinc-900"
                      : "border-zinc-300 bg-white"
                  }`}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check className="h-4 w-4 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Repo Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-zinc-900">{repo.name}</p>
                    {repo.private ? (
                      <Lock className="h-3.5 w-3.5 text-zinc-400" />
                    ) : (
                      <Globe className="h-3.5 w-3.5 text-zinc-400" />
                    )}
                  </div>
                  {repo.description && (
                    <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
                      {repo.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-xs text-zinc-400">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-zinc-400" />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <GitBranch className="h-3 w-3" />
                      {repo.fullName.split("/")[0]}
                    </span>
                    <span>
                      Updated {new Date(repo.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })
        )}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-6">
        <p className="text-sm text-zinc-500">
          {selectedRepos.length} {selectedRepos.length === 1 ? "repository" : "repositories"}{" "}
          selected
        </p>
        <Button
          onClick={handleSave}
          disabled={isSaving || (!hasChanges && !saveSuccess)}
          className="h-12 rounded-xl bg-zinc-900 px-6 font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Saved!
            </>
          ) : (
            "Save Selection"
          )}
        </Button>
      </div>
    </div>
  );
}
