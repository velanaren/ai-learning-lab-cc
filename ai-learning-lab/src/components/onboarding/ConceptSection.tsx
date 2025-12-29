"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  AlertTriangle,
  Code,
  ArrowRight,
  Target,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import type { ConceptNode } from "@/lib/groq/prompts";

interface ConceptSectionProps {
  title: "Beginner" | "Intermediate" | "Advanced";
  nodes: ConceptNode[];
  allNodes: ConceptNode[];
  startingDayNumber: number;
}

const difficultyConfig = {
  Beginner: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    header: "text-emerald-700",
    icon: "bg-emerald-100 text-emerald-600",
    line: "bg-emerald-200",
    dayBadge: "bg-emerald-500",
    outcome: "After this section, you'll have a solid foundation to build upon.",
    description: "Core concepts to get you started",
  },
  Intermediate: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    header: "text-amber-700",
    icon: "bg-amber-100 text-amber-600",
    line: "bg-amber-200",
    dayBadge: "bg-amber-500",
    outcome: "You'll be able to work independently on real projects.",
    description: "Building blocks for practical usage",
  },
  Advanced: {
    badge: "bg-violet-100 text-violet-700 border-violet-200",
    header: "text-violet-700",
    icon: "bg-violet-100 text-violet-600",
    line: "bg-violet-200",
    dayBadge: "bg-violet-500",
    outcome: "You'll master advanced patterns and best practices.",
    description: "Deep dives for mastery",
  },
};

export function ConceptSection({
  title,
  nodes,
  allNodes,
  startingDayNumber,
}: ConceptSectionProps) {
  if (!nodes || nodes.length === 0) {
    return null;
  }

  const config = difficultyConfig[title];

  // Create a map for looking up concept names by ID
  const conceptNameMap = new Map<string, string>();
  for (const node of allNodes) {
    conceptNameMap.set(node.id, node.conceptName);
  }

  // Calculate total time for this section
  const totalMinutes = nodes.reduce((acc, n) => acc + (n.estimatedMinutes || 10), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Section Header */}
      <div className="rounded-2xl border border-zinc-200/80 bg-gradient-to-r from-zinc-50 to-white p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className={`text-xl font-semibold ${config.header}`}>{title}</h2>
              <Badge
                variant="outline"
                className={`${config.badge} text-xs font-medium`}
              >
                {nodes.length} concepts
              </Badge>
              <Badge variant="outline" className="border-zinc-200 bg-zinc-50 text-zinc-600 text-xs">
                <Clock className="h-3 w-3 mr-1" />
                ~{Math.round(totalMinutes / 60 * 10) / 10}h
              </Badge>
            </div>
            <p className="text-sm text-zinc-500">{config.description}</p>
          </div>
        </div>

        {/* Section Outcome */}
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-zinc-100/50 p-3">
          <Target className={`h-4 w-4 mt-0.5 ${config.header}`} />
          <p className="text-sm text-zinc-600">
            <span className="font-medium">Goal:</span> {config.outcome}
          </p>
        </div>
      </div>

      {/* Concept List with Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className={`absolute left-6 top-0 bottom-0 w-0.5 ${config.line}`} />

        <div className="space-y-3">
          {nodes.map((node, index) => {
            const dayNumber = startingDayNumber + index;

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="relative pl-14"
              >
                {/* Day Number Badge */}
                <div className={`absolute left-3 top-4 flex h-7 w-7 items-center justify-center rounded-full ${config.dayBadge} text-white text-xs font-bold shadow-md z-10`}>
                  {dayNumber}
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem
                    value={node.id}
                    className="rounded-2xl border border-zinc-200 bg-white overflow-hidden data-[state=open]:shadow-lg transition-shadow duration-200"
                  >
                    <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-zinc-50/50">
                      <div className="flex flex-1 flex-col items-start gap-1 pr-4 text-left">
                        <div className="flex w-full items-center justify-between">
                          <span className="text-base font-medium text-zinc-900">
                            {node.conceptName}
                          </span>
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1 border-zinc-200 bg-zinc-50 text-zinc-500 text-xs ml-2 shrink-0"
                          >
                            <Clock className="h-3 w-3" />
                            {node.estimatedMinutes}m
                          </Badge>
                        </div>
                        {/* Short Description - Always Visible */}
                        {node.shortDescription && (
                          <p className="text-sm text-zinc-500 line-clamp-1">
                            {node.shortDescription}
                          </p>
                        )}
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4 pt-2 border-t border-zinc-100">
                        {/* Learning Outcome */}
                        {node.learningOutcome && (
                          <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-emerald-800">
                                What you'll learn
                              </p>
                              <p className="text-sm text-emerald-700 mt-0.5">
                                {node.learningOutcome}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Prerequisites */}
                        {node.prerequisites && node.prerequisites.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-zinc-500">
                              Builds on:
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
                            <div className="flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-zinc-600 mt-0.5 shrink-0" />
                              <p className="text-sm leading-relaxed text-zinc-600">
                                {node.whyItMatters}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Common Confusions */}
                        {node.commonConfusions && node.commonConfusions.length > 0 && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <div className="mb-2 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                              <span className="text-sm font-medium text-amber-700">
                                Watch out for
                              </span>
                            </div>
                            <ul className="space-y-1.5">
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
                                Quick example
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
                </Accordion>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
