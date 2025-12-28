"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, BookOpen, Target, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Strategy {
  startLevel: string;
  dailySlicePolicy: string;
  applicationFrequency: string;
  linkBudgetPolicy: string;
}

interface TopicData {
  name: string;
  strategy: Strategy;
}

export default function GraphPage() {
  const router = useRouter();
  const [topicData, setTopicData] = useState<TopicData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/onboarding/graph-data");
        if (response.ok) {
          const data = await response.json();
          setTopicData(data);
        }
      } catch (error) {
        console.error("Failed to fetch graph data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const strategyItems = topicData?.strategy
    ? [
        {
          icon: Target,
          label: "Starting Level",
          value: topicData.strategy.startLevel,
        },
        {
          icon: BookOpen,
          label: "Daily Approach",
          value:
            topicData.strategy.dailySlicePolicy === "one-concept-strict"
              ? "One concept per day"
              : topicData.strategy.dailySlicePolicy,
        },
        {
          icon: Zap,
          label: "Application Frequency",
          value: topicData.strategy.applicationFrequency.replace(/-/g, " "),
        },
        {
          icon: Clock,
          label: "External Links",
          value: topicData.strategy.linkBudgetPolicy,
        },
      ]
    : [];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-100">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.05),transparent_50%)]" />

      <div className="relative py-12 sm:py-16">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          {/* Success Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="mb-8 flex justify-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              >
                <Check className="h-10 w-10 text-green-600" />
              </motion.div>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">
              <Sparkles className="h-4 w-4 text-green-700" />
              <span className="text-sm font-medium text-green-700">
                Setup Complete
              </span>
            </div>
            <h1 className="text-3xl font-medium tracking-tight text-zinc-900 sm:text-4xl">
              Learning Plan Created
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-zinc-500">
              {isLoading ? (
                "Loading your personalized learning path..."
              ) : (
                <>
                  Your personalized{" "}
                  <span className="font-medium text-zinc-900">
                    {topicData?.name}
                  </span>{" "}
                  learning path is ready
                </>
              )}
            </p>
          </motion.div>

          {/* Strategy Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30 sm:p-8"
          >
            <h2 className="mb-6 text-xl font-medium text-zinc-900">
              Your Learning Strategy
            </h2>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-2xl bg-zinc-100"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {strategyItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                    className="flex items-center justify-between rounded-2xl bg-zinc-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                        <item.icon className="h-5 w-5 text-zinc-600" />
                      </div>
                      <span className="text-sm font-medium text-zinc-700">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-sm capitalize text-zinc-900">
                      {item.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Coming Soon Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <Sparkles className="h-4 w-4 text-amber-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Topic Graph Generation Coming Soon
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  The next step will generate your personalized concept map and
                  daily learning plan.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8 flex justify-center"
          >
            <Button
              onClick={() => router.push("/dashboard/today")}
              className="group h-14 rounded-2xl bg-zinc-900 px-8 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all duration-200 hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
