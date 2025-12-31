"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { List, CheckCircle2, Paperclip } from "lucide-react";

interface MemoryFilterTabsProps {
  currentFilter: string;
  counts?: {
    all: number;
    applied: number;
    proofBacked: number;
  };
  topicId?: string;
}

const tabs = [
  { value: "all", label: "All", icon: List, countKey: "all" as const },
  { value: "applied", label: "Applied", icon: CheckCircle2, countKey: "applied" as const },
  { value: "proof-backed", label: "Proof-backed", icon: Paperclip, countKey: "proofBacked" as const },
];

export function MemoryFilterTabs({ currentFilter, counts, topicId }: MemoryFilterTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Build base URL based on whether we're in topic-specific or legacy view
  const baseUrl = topicId
    ? `/dashboard/topics/${topicId}/memory`
    : `/dashboard/memory`;

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("filter");
    } else {
      params.set("filter", value);
    }
    router.push(`${baseUrl}?${params.toString()}`);
  };

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-1.5 shadow-lg shadow-zinc-200/30">
      <div className="grid grid-cols-3 gap-1">
        {tabs.map((tab) => {
          const isSelected = currentFilter === tab.value;
          const Icon = tab.icon;
          const count = counts?.[tab.countKey];

          return (
            <motion.button
              key={tab.value}
              onClick={() => handleFilterChange(tab.value)}
              whileHover={{ scale: isSelected ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {count !== undefined && (
                <span
                  className={`ml-1 text-xs ${
                    isSelected ? "text-zinc-300" : "text-zinc-400"
                  }`}
                >
                  ({count})
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
