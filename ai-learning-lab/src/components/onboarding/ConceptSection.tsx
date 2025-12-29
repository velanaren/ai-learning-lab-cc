"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, Code, ArrowRight } from "lucide-react";
import type { ConceptNode } from "@/lib/groq/prompts";

interface ConceptSectionProps {
  title: "Beginner" | "Intermediate" | "Advanced";
  nodes: ConceptNode[];
  allNodes: ConceptNode[];
}

const difficultyColors = {
  Beginner: {
    badge: "bg-green-100 text-green-700 border-green-200",
    header: "text-green-700",
    icon: "bg-green-100",
  },
  Intermediate: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    header: "text-amber-700",
    icon: "bg-amber-100",
  },
  Advanced: {
    badge: "bg-red-100 text-red-700 border-red-200",
    header: "text-red-700",
    icon: "bg-red-100",
  },
};

export function ConceptSection({ title, nodes, allNodes }: ConceptSectionProps) {
  if (!nodes || nodes.length === 0) {
    return null;
  }

  const colors = difficultyColors[title];

  // Create a map for looking up concept names by ID
  const conceptNameMap = new Map<string, string>();
  for (const node of allNodes) {
    conceptNameMap.set(node.id, node.conceptName);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <h2 className={`text-xl font-medium ${colors.header}`}>{title}</h2>
        <Badge
          variant="outline"
          className={`${colors.badge} text-xs font-medium`}
        >
          {nodes.length} concepts
        </Badge>
      </div>

      {/* Accordion List */}
      <Accordion type="multiple" className="w-full space-y-2">
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <AccordionItem
              value={node.id}
              className="rounded-2xl border border-zinc-200 bg-white px-4 data-[state=open]:bg-zinc-50"
            >
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex flex-1 items-center justify-between pr-4">
                  <span className="text-left text-base font-medium text-zinc-900">
                    {node.conceptName}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 border-zinc-200 bg-zinc-50 text-zinc-600"
                    >
                      <Clock className="h-3 w-3" />
                      {node.estimatedMinutes} min
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-4">
                <div className="space-y-4 pt-2">
                  {/* Prerequisites */}
                  {node.prerequisites && node.prerequisites.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-zinc-500">
                        Requires:
                      </span>
                      {node.prerequisites.map((prereqId) => (
                        <Badge
                          key={prereqId}
                          variant="outline"
                          className="border-zinc-200 bg-zinc-100 text-xs text-zinc-700"
                        >
                          <ArrowRight className="mr-1 h-3 w-3" />
                          {conceptNameMap.get(prereqId) || prereqId}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Why it matters */}
                  {node.whyItMatters && (
                    <div className="rounded-xl bg-zinc-100 p-4">
                      <p className="text-sm leading-relaxed text-zinc-600">
                        <span className="font-medium text-zinc-700">
                          Why it matters:{" "}
                        </span>
                        {node.whyItMatters}
                      </p>
                    </div>
                  )}

                  {/* Common Confusions */}
                  {node.commonConfusions && node.commonConfusions.length > 0 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-700">
                          Common Confusions
                        </span>
                      </div>
                      <ul className="space-y-1">
                        {node.commonConfusions.map((confusion, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-amber-700"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                            {confusion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Example Hook */}
                  {node.exampleHook && (
                    <div className="rounded-xl border border-zinc-200 bg-zinc-900 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Code className="h-4 w-4 text-zinc-400" />
                        <span className="text-sm font-medium text-zinc-400">
                          Example
                        </span>
                      </div>
                      <pre className="overflow-x-auto text-sm text-zinc-100">
                        <code>{node.exampleHook}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </motion.div>
  );
}
