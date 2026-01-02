"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="card-featured">
      <div className="mb-6">
        <h3 className="text-lg font-medium lowercase" style={{ color: "var(--text-white)" }}>
          select repositories
        </h3>
        <p className="mt-1 text-sm lowercase" style={{ color: "var(--text-gray)" }}>
          choose which repositories you want to track. commits and pull requests from
          selected repos can be imported as evidence.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          placeholder="search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 w-full rounded-xl pl-10 pr-4 text-sm lowercase transition-all duration-300 placeholder:lowercase focus:outline-none"
          style={{
            backgroundColor: "var(--bg-dark)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "var(--text-white)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-primary)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
          }}
        />
      </div>

      {/* Repository List */}
      <div className="max-h-96 space-y-2 overflow-y-auto">
        {filteredRepos.length === 0 ? (
          <p className="py-8 text-center text-sm lowercase" style={{ color: "var(--text-muted)" }}>
            {searchQuery ? "no repositories match your search" : "no repositories found"}
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
                className="flex w-full items-start gap-4 rounded-xl p-4 text-left transition-all duration-200"
                style={{
                  backgroundColor: isSelected ? "var(--accent-glow)" : "var(--bg-dark)",
                  border: isSelected
                    ? "1px solid var(--accent-primary)"
                    : "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                {/* Checkbox */}
                <div
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-all"
                  style={{
                    backgroundColor: isSelected ? "var(--accent-primary)" : "transparent",
                    border: isSelected
                      ? "2px solid var(--accent-primary)"
                      : "2px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check className="h-4 w-4" style={{ color: "var(--bg-dark)" }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Repo Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className="font-medium lowercase"
                      style={{ color: isSelected ? "var(--accent-primary)" : "var(--text-white)" }}
                    >
                      {repo.name}
                    </p>
                    {repo.private ? (
                      <Lock className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
                    ) : (
                      <Globe className="h-3.5 w-3.5" style={{ color: "var(--text-muted)" }} />
                    )}
                  </div>
                  {repo.description && (
                    <p
                      className="mt-1 line-clamp-1 text-sm lowercase"
                      style={{ color: "var(--text-gray)" }}
                    >
                      {repo.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    {repo.language && (
                      <span className="flex items-center gap-1 lowercase">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: "var(--accent-primary)" }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1 lowercase">
                      <GitBranch className="h-3 w-3" />
                      {repo.fullName.split("/")[0]}
                    </span>
                    <span className="lowercase">
                      updated {new Date(repo.updatedAt).toLocaleDateString()}
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
            className="mt-4 rounded-lg px-3 py-2 text-sm lowercase"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              color: "#ef4444",
            }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div
        className="mt-6 flex items-center justify-between border-t pt-6"
        style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
      >
        <p className="text-sm lowercase" style={{ color: "var(--text-gray)" }}>
          {selectedRepos.length} {selectedRepos.length === 1 ? "repository" : "repositories"}{" "}
          selected
        </p>
        <button
          onClick={handleSave}
          disabled={isSaving || (!hasChanges && !saveSuccess)}
          className="btn-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              saving...
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              saved!
            </>
          ) : (
            "save selection"
          )}
        </button>
      </div>
    </div>
  );
}
