"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatDistanceToNow, format } from "date-fns";
import {
  ChevronDown,
  CheckCircle2,
  Paperclip,
  ExternalLink,
  MessageSquare,
  Zap,
  Plus,
} from "lucide-react";
import { EvidenceCaptureModal } from "./EvidenceCaptureModal";

interface EvidenceItem {
  id: string;
  type: string;
  urlOrBlobRef: string;
  label: string | null;
  sourceType: string;
}

interface MemoryEntryData {
  id: string;
  conceptId: string;
  reflectionText: string | null;
  actionTaken: string | null;
  createdAt: Date | string;
  tags: string[];
  topic: {
    name: string;
  };
  evidenceItems: EvidenceItem[];
}

interface MemoryEntryCardProps {
  entry: MemoryEntryData;
  conceptName?: string;
}

export function MemoryEntryCard({ entry, conceptName }: MemoryEntryCardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);

  const hasEvidence = entry.evidenceItems.length > 0;
  const hasAction = entry.actionTaken !== null && entry.actionTaken.length > 0;
  const hasReflection = entry.reflectionText !== null && entry.reflectionText.length > 0;

  // Color coding for left border
  const borderColor = hasEvidence
    ? "border-l-blue-500"
    : hasAction
      ? "border-l-green-500"
      : "border-l-zinc-300";

  const createdAt = typeof entry.createdAt === "string"
    ? new Date(entry.createdAt)
    : entry.createdAt;

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case "github_commit":
      case "github_pr":
      case "github_file":
        return "GitHub";
      case "link":
        return "Link";
      case "code_snippet":
        return "Code";
      case "screenshot":
        return "Screenshot";
      case "output":
        return "Output";
      default:
        return "Evidence";
    }
  };

  return (
    <div className={`rounded-3xl border border-zinc-200/80 bg-white shadow-xl shadow-zinc-200/30 overflow-hidden border-l-4 ${borderColor} transition-all duration-200 hover:shadow-2xl hover:shadow-zinc-200/40`}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Date and Topic */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-600"
                >
                  {entry.topic.name}
                </Badge>
                <span className="text-xs text-zinc-400">
                  {formatDistanceToNow(createdAt, { addSuffix: true })}
                </span>
                <span className="text-xs text-zinc-300">
                  {format(createdAt, "MMM d, yyyy")}
                </span>
              </div>

              {/* Concept Name */}
              <h3 className="text-lg font-medium tracking-tight text-zinc-900 truncate">
                {conceptName || entry.conceptId}
              </h3>

              {/* Reflection Preview */}
              {hasReflection && (
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 line-clamp-2">
                  {entry.reflectionText}
                </p>
              )}

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {hasAction && (
                  <Badge className="rounded-full bg-green-100 text-green-700 hover:bg-green-100 border-0 gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Applied
                  </Badge>
                )}
                {hasEvidence && (
                  <Badge className="rounded-full bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 gap-1.5">
                    <Paperclip className="h-3.5 w-3.5" />
                    {entry.evidenceItems.length}{" "}
                    {entry.evidenceItems.length === 1 ? "item" : "items"}
                  </Badge>
                )}
                {hasReflection && !open && (
                  <Badge
                    variant="outline"
                    className="rounded-full border-zinc-200 text-zinc-500 gap-1.5"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Reflection
                  </Badge>
                )}
              </div>
            </div>

            {/* Expand Button */}
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 h-10 w-10 rounded-xl hover:bg-zinc-100 transition-colors"
              >
                <ChevronDown
                  className={`h-5 w-5 text-zinc-400 transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent>
          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="space-y-5 border-t border-zinc-100 pt-5">
              {/* Full Reflection */}
              {hasReflection && (
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-200">
                      <MessageSquare className="h-4 w-4 text-zinc-600" />
                    </div>
                    <h4 className="text-sm font-medium text-zinc-700">
                      Reflection
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-600 whitespace-pre-wrap">
                    {entry.reflectionText}
                  </p>
                </div>
              )}

              {/* Action Taken */}
              {hasAction && (
                <div className="rounded-2xl bg-green-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                      <Zap className="h-4 w-4 text-green-600" />
                    </div>
                    <h4 className="text-sm font-medium text-green-800">
                      Action Taken
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-green-700">
                    {entry.actionTaken}
                  </p>
                </div>
              )}

              {/* Evidence Items */}
              {hasEvidence && (
                <div className="rounded-2xl bg-blue-50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                      <Paperclip className="h-4 w-4 text-blue-600" />
                    </div>
                    <h4 className="text-sm font-medium text-blue-800">
                      Evidence
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.evidenceItems.map((item) => (
                      <a
                        key={item.id}
                        href={item.urlOrBlobRef}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm text-blue-700 transition-all duration-200 hover:bg-blue-100 hover:border-blue-300 hover:shadow-sm"
                      >
                        <span className="text-xs font-medium text-blue-500">
                          {getEvidenceIcon(item.type)}
                        </span>
                        <span className="font-medium">
                          {item.label || "View evidence"}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state for expanded view */}
              {!hasReflection && !hasAction && !hasEvidence && (
                <div className="rounded-2xl bg-zinc-50 p-4 text-center">
                  <p className="text-sm text-zinc-400">
                    No details recorded for this learning session.
                  </p>
                </div>
              )}

              {/* Add Evidence Button */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  className="h-11 gap-2 rounded-xl border-2 border-zinc-200 px-4 hover:border-zinc-300 hover:bg-zinc-50 transition-all duration-200"
                  onClick={() => setShowEvidenceModal(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Evidence
                </Button>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Evidence Capture Modal */}
      <EvidenceCaptureModal
        memoryEntryId={entry.id}
        open={showEvidenceModal}
        onOpenChange={setShowEvidenceModal}
        onComplete={() => {
          setShowEvidenceModal(false);
          router.refresh();
        }}
      />
    </div>
  );
}
