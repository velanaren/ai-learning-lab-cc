import { Suspense } from "react";
import { redirect } from "next/navigation";
import { History, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { MemoryEntryCard } from "@/components/memory/MemoryEntryCard";
import { MemoryFilterTabs } from "@/components/memory/MemoryFilterTabs";

export const metadata: Metadata = {
  title: "Memory | AI Learning Lab",
  description: "Your learning memory and evidence",
};

interface MemoryPageProps {
  searchParams: Promise<{ filter?: string }>;
}

async function MemoryContent({ filter }: { filter: string }) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Get user from database to ensure we have the ID
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  const userId = user.id;

  // Build where clause based on filter
  type WhereClause = {
    userId: string;
    actionTaken?: { not: null };
    evidenceItems?: { some: Record<string, never> };
  };

  const whereClause: WhereClause = { userId };

  if (filter === "applied") {
    whereClause.actionTaken = { not: null };
  } else if (filter === "proof-backed") {
    whereClause.evidenceItems = { some: {} };
  }

  // Fetch entries
  const entries = await prisma.memoryEntry.findMany({
    where: whereClause,
    include: {
      topic: true,
      evidenceItems: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Get counts for tabs
  const [allCount, appliedCount, proofBackedCount] = await Promise.all([
    prisma.memoryEntry.count({ where: { userId } }),
    prisma.memoryEntry.count({
      where: { userId, actionTaken: { not: null } },
    }),
    prisma.memoryEntry.count({
      where: { userId, evidenceItems: { some: {} } },
    }),
  ]);

  // Get concept names from the topic graph for display
  const conceptNamesMap = new Map<string, string>();

  if (entries.length > 0) {
    // Get all unique topic IDs
    const topicIds = [...new Set(entries.map((e) => e.topicId))];

    // Fetch the latest locked graph for each topic
    const graphs = await prisma.topicGraphVersion.findMany({
      where: {
        topicId: { in: topicIds },
        lockedByUser: true,
      },
      orderBy: { version: "desc" },
    });

    // Extract concept names from graph nodes
    for (const graph of graphs) {
      const nodes = graph.nodesJson as Array<{
        id: string;
        conceptName: string;
      }>;
      if (Array.isArray(nodes)) {
        for (const node of nodes) {
          conceptNamesMap.set(node.id, node.conceptName);
        }
      }
    }
  }

  return (
    <>
      {/* Filter Tabs */}
      <MemoryFilterTabs
        currentFilter={filter}
        counts={{
          all: allCount,
          applied: appliedCount,
          proofBacked: proofBackedCount,
        }}
      />

      {/* Timeline */}
      <div className="mt-8 space-y-4">
        {entries.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          entries.map((entry, index) => (
            <div
              key={entry.id}
              style={{ animationDelay: `${index * 0.05}s` }}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <MemoryEntryCard
                entry={entry}
                conceptName={conceptNamesMap.get(entry.conceptId)}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}

function EmptyState({ filter }: { filter: string }) {
  const messages = {
    all: {
      title: "No memories yet",
      description:
        "Complete your first learning day to start building your memory journal. Every concept you learn and every reflection you write becomes part of your learning history.",
    },
    applied: {
      title: "No applied learnings yet",
      description:
        "When you complete the application moment in your daily lessons, those entries will appear here. Practice makes permanent!",
    },
    "proof-backed": {
      title: "No proof-backed entries yet",
      description:
        "Add evidence to your learnings - GitHub commits, code snippets, or screenshots. Make your progress tangible and shareable.",
    },
  };

  const message = messages[filter as keyof typeof messages] || messages.all;

  return (
    <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 text-center shadow-xl shadow-zinc-200/30 sm:p-12">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
        <BookOpen className="h-8 w-8 text-zinc-400" />
      </div>
      <h3 className="text-lg font-medium text-zinc-900">{message.title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
        {message.description}
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-14 w-full animate-pulse rounded-2xl bg-zinc-100" />
      <div className="mt-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-3xl bg-zinc-100"
          />
        ))}
      </div>
    </div>
  );
}

export default async function MemoryPage({ searchParams }: MemoryPageProps) {
  const params = await searchParams;
  const filter = params.filter || "all";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

      {/* Content */}
      <div className="relative py-8 sm:py-12">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900">
                <History className="h-6 w-6 text-white" />
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                Learning Journal
              </span>
            </div>
            <h1 className="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
              Memory
            </h1>
            <p className="mt-2 text-base leading-relaxed text-zinc-500">
              Your learning journey - reflections, applications, and proof of progress
            </p>
          </div>

          {/* Content */}
          <Suspense fallback={<LoadingSkeleton />}>
            <MemoryContent filter={filter} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
