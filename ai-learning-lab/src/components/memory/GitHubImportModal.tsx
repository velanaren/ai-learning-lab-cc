"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Check,
  Loader2,
  GitCommit,
  GitPullRequest,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Settings,
  GitMerge,
  ArrowLeft,
} from "lucide-react";

interface GitHubCommit {
  id: string;
  title: string;
  message: string;
  repo: string;
  date: string;
  url: string;
  author: string | null;
}

interface GitHubPullRequest {
  id: number;
  title: string;
  repo: string;
  date: string;
  url: string;
  state: "open" | "closed" | "merged";
  number: number;
}

interface GitHubImportModalProps {
  memoryEntryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  onBack?: () => void;
}

export function GitHubImportModal({
  memoryEntryId,
  open,
  onOpenChange,
  onComplete,
  onBack,
}: GitHubImportModalProps) {
  const [tab, setTab] = useState<"commits" | "prs">("commits");
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [prs, setPrs] = useState<GitHubPullRequest[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [notConnected, setNotConnected] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setNotConnected(false);

    try {
      const endpoint = tab === "commits" ? "/api/github/commits" : "/api/github/prs";
      const response = await fetch(endpoint);

      if (!response.ok) {
        const data = await response.json();
        if (data.connected === false) {
          setNotConnected(true);
          return;
        }
        throw new Error(data.error || "Failed to fetch");
      }

      const data = await response.json();
      if (tab === "commits") {
        setCommits(data.items || []);
      } else {
        setPrs(data.items || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    if (open) {
      fetchData();
      setSelectedItems([]);
      setSuccess(false);
    }
  }, [open, tab, fetchData]);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleImport = async () => {
    if (selectedItems.length === 0) return;

    setIsImporting(true);
    setError(null);

    try {
      // Import each selected item as evidence
      const items = tab === "commits" ? commits : prs;
      const selectedData = items.filter((item) =>
        selectedItems.includes(tab === "commits" ? (item as GitHubCommit).id : String((item as GitHubPullRequest).id))
      );

      for (const item of selectedData) {
        const evidenceData = {
          memoryEntryId,
          type: tab === "commits" ? "github_commit" : "github_pr",
          urlOrBlobRef: tab === "commits" ? (item as GitHubCommit).url : (item as GitHubPullRequest).url,
          label: tab === "commits"
            ? `${(item as GitHubCommit).title} (${(item as GitHubCommit).repo})`
            : `#${(item as GitHubPullRequest).number} ${(item as GitHubPullRequest).title} (${(item as GitHubPullRequest).repo})`,
          sourceType: "verifiable",
        };

        const response = await fetch("/api/evidence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(evidenceData),
        });

        if (!response.ok) {
          throw new Error("Failed to import evidence");
        }
      }

      setSuccess(true);
      setTimeout(() => {
        onComplete();
        onOpenChange(false);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import");
    } finally {
      setIsImporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getPrStatusBadge = (state: "open" | "closed" | "merged") => {
    switch (state) {
      case "merged":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
            <GitMerge className="h-3 w-3" />
            Merged
          </span>
        );
      case "open":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            Open
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            Closed
          </span>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden sm:rounded-3xl">
        <DialogHeader>
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2 mb-2 w-fit text-zinc-500 hover:text-zinc-700"
              onClick={onBack}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          )}
          <DialogTitle className="text-xl font-medium tracking-tight">
            Import from GitHub
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Select commits or pull requests to add as verifiable evidence
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
              >
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </motion.div>
              <p className="text-lg font-medium text-zinc-900">Evidence imported!</p>
              <p className="text-sm text-zinc-500">{selectedItems.length} items added</p>
            </motion.div>
          ) : notConnected ? (
            <motion.div
              key="not-connected"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-12"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
                <AlertCircle className="h-8 w-8 text-zinc-400" />
              </div>
              <p className="text-lg font-medium text-zinc-900">GitHub Not Connected</p>
              <p className="mt-2 text-center text-sm text-zinc-500">
                Connect your GitHub account to import commits and pull requests
              </p>
              <Button
                asChild
                className="mt-6 h-12 rounded-xl bg-zinc-900 px-6 font-medium shadow-lg shadow-zinc-900/20"
              >
                <a href="/settings/github" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Go to Settings
                </a>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Tabs value={tab} onValueChange={(v) => setTab(v as "commits" | "prs")}>
                <TabsList className="grid w-full grid-cols-2 rounded-xl bg-zinc-100 p-1">
                  <TabsTrigger
                    value="commits"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <GitCommit className="mr-2 h-4 w-4" />
                    Commits
                  </TabsTrigger>
                  <TabsTrigger
                    value="prs"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <GitPullRequest className="mr-2 h-4 w-4" />
                    Pull Requests
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4 max-h-80 min-h-48 overflow-y-auto rounded-xl border border-zinc-200">
                  {isLoading ? (
                    <div className="flex h-48 items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                    </div>
                  ) : error ? (
                    <div className="flex h-48 flex-col items-center justify-center p-4 text-center">
                      <AlertCircle className="mb-2 h-6 w-6 text-red-400" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  ) : (
                    <>
                      <TabsContent value="commits" className="m-0">
                        {commits.length === 0 ? (
                          <div className="flex h-48 flex-col items-center justify-center text-center">
                            <GitCommit className="mb-2 h-6 w-6 text-zinc-300" />
                            <p className="text-sm text-zinc-400">No commits found</p>
                            <p className="mt-1 text-xs text-zinc-400">
                              Select repositories in Settings first
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-zinc-100">
                            {commits.map((commit) => {
                              const isSelected = selectedItems.includes(commit.id);
                              return (
                                <button
                                  key={commit.id}
                                  onClick={() => toggleItem(commit.id)}
                                  className={`flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-zinc-50 ${
                                    isSelected ? "bg-zinc-50" : ""
                                  }`}
                                >
                                  <div
                                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                                      isSelected
                                        ? "border-zinc-900 bg-zinc-900"
                                        : "border-zinc-300"
                                    }`}
                                  >
                                    {isSelected && <Check className="h-3 w-3 text-white" />}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="line-clamp-1 text-sm font-medium text-zinc-900">
                                      {commit.title}
                                    </p>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                                      <span className="truncate">{commit.repo}</span>
                                      <span>·</span>
                                      <span className="shrink-0">{formatDate(commit.date)}</span>
                                    </div>
                                  </div>
                                  <a
                                    href={commit.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="shrink-0 p-1 text-zinc-400 hover:text-zinc-600"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="prs" className="m-0">
                        {prs.length === 0 ? (
                          <div className="flex h-48 flex-col items-center justify-center text-center">
                            <GitPullRequest className="mb-2 h-6 w-6 text-zinc-300" />
                            <p className="text-sm text-zinc-400">No pull requests found</p>
                            <p className="mt-1 text-xs text-zinc-400">
                              Select repositories in Settings first
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-zinc-100">
                            {prs.map((pr) => {
                              const isSelected = selectedItems.includes(String(pr.id));
                              return (
                                <button
                                  key={pr.id}
                                  onClick={() => toggleItem(String(pr.id))}
                                  className={`flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-zinc-50 ${
                                    isSelected ? "bg-zinc-50" : ""
                                  }`}
                                >
                                  <div
                                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                                      isSelected
                                        ? "border-zinc-900 bg-zinc-900"
                                        : "border-zinc-300"
                                    }`}
                                  >
                                    {isSelected && <Check className="h-3 w-3 text-white" />}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="line-clamp-1 text-sm font-medium text-zinc-900">
                                        #{pr.number} {pr.title}
                                      </p>
                                      {getPrStatusBadge(pr.state)}
                                    </div>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                                      <span className="truncate">{pr.repo}</span>
                                      <span>·</span>
                                      <span className="shrink-0">{formatDate(pr.date)}</span>
                                    </div>
                                  </div>
                                  <a
                                    href={pr.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="shrink-0 p-1 text-zinc-400 hover:text-zinc-600"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </TabsContent>
                    </>
                  )}
                </div>
              </Tabs>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                <p className="text-sm text-zinc-500">
                  {selectedItems.length} items selected
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="h-11 rounded-xl border-2 border-zinc-200 px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={selectedItems.length === 0 || isImporting}
                    className="h-11 rounded-xl bg-zinc-900 px-6 font-medium shadow-lg shadow-zinc-900/20 hover:bg-zinc-800 disabled:opacity-50"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      `Import ${selectedItems.length || ""} ${
                        selectedItems.length === 1 ? "item" : "items"
                      }`
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
