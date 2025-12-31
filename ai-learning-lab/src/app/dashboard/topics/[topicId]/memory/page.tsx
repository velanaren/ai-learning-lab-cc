import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { History, BookOpen, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { MemoryEntryCard } from "@/components/memory/MemoryEntryCard";
import { MemoryFilterTabs } from "@/components/memory/MemoryFilterTabs";

export const metadata: Metadata = {
  title: "Memory | AI Learning Lab",
  description: "Your learning memory and evidence for this topic",
};

interface TopicMemoryPageProps {
  params: Promise<{ topicId: string }>;
  searchParams: Promise<{ filter?: string }>;
}

async function TopicMemoryContent({
  filter,
  topicId,
  topicName,
}: {
  filter: string;
  topicId: string;
  topicName: string;
}) {
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

  // Build where clause based on filter - scoped to this topic
  type WhereClause = {
    userId: string;
    topicId: string;
    actionTaken?: { not: null };
    evidenceItems?: { some: Record<string, never> };
  };

  const whereClause: WhereClause = { userId, topicId };

  if (filter === "applied") {
    whereClause.actionTaken = { not: null };
  } else if (filter === "proof-backed") {
    whereClause.evidenceItems = { some: {} };
  }

  // Fetch entries for this topic
  const entries = await prisma.memoryEntry.findMany({
    where: whereClause,
    include: {
      topic: true,
      evidenceItems: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Get counts for tabs - scoped to this topic
  const [allCount, appliedCount, proofBackedCount] = await Promise.all([
    prisma.memoryEntry.count({ where: { userId, topicId } }),
    prisma.memoryEntry.count({
      where: { userId, topicId, actionTaken: { not: null } },
    }),
    prisma.memoryEntry.count({
      where: { userId, topicId, evidenceItems: { some: {} } },
    }),
  ]);

  // Get concept names from the topic graph for display
  const conceptNamesMap = new Map<string, string>();

  // Fetch the latest locked graph for this topic
  const graph = await prisma.topicGraphVersion.findFirst({
    where: {
      topicId,
      lockedByUser: true,
    },
    orderBy: { version: "desc" },
  });

  if (graph) {
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
        topicId={topicId}
      />

      {/* Timeline */}
      <div className="mt-8 space-y-4">
        {entries.length === 0 ? (
          <EmptyState filter={filter} topicName={topicName} />
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

function EmptyState({ filter, topicName }: { filter: string; topicName: string }) {
  const messages = {
    all: {
      title: "No memories yet",
      description: `Complete your first learning day in ${topicName} to start building your memory journal. Every concept you learn and every reflection you write becomes part of your learning history.`,
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

export default async function TopicMemoryPage({
  params,
  searchParams,
}: TopicMemoryPageProps) {
  const { topicId } = await params;
  const { filter = "all" } = await searchParams;

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Verify topic belongs to user and get topic name
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      topics: {
        where: { id: topicId },
      },
    },
  });

  if (!user || user.topics.length === 0) {
    redirect("/dashboard");
  }

  const topicName = user.topics[0].name;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

      {/* Content */}
      <div className="relative py-8 sm:py-12">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          {/* Back to Dashboard */}
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900">
                <History className="h-6 w-6 text-white" />
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                {topicName}
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
            <TopicMemoryContent
              filter={filter}
              topicId={topicId}
              topicName={topicName}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
