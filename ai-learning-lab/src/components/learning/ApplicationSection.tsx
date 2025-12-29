"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CodeBlock } from "@/components/ui/code-block";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ApplicationMoment {
  task: string;
  guidance: string;
  expectedOutput: string;
}

interface ApplicationSectionProps {
  task: ApplicationMoment;
  conceptId: string;
  onCompletedChange: (completed: boolean) => void;
  disabled?: boolean;
}

export function ApplicationSection({
  task,
  conceptId,
  onCompletedChange,
  disabled = false,
}: ApplicationSectionProps) {
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const storageKey = `app-completed-${conceptId}`;

  const handleCompletedChange = (checked: boolean) => {
    setCompleted(checked);
    onCompletedChange(checked);
    localStorage.setItem(storageKey, checked.toString());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-xl shadow-blue-100/30 sm:p-8"
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto w-full justify-between p-0 hover:bg-transparent"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-medium text-blue-900">
                  Try It Yourself
                </h2>
                <p className="text-sm text-blue-600">
                  Optional practice (5-10 minutes)
                </p>
              </div>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-blue-600 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-6 space-y-6">
            {/* Task */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-blue-900">Task</h3>
              <p className="text-base leading-relaxed text-blue-800">
                {task.task}
              </p>
            </div>

            {/* Guidance */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-blue-900">
                Guidance
              </h3>
              <p className="text-sm leading-relaxed text-blue-700">
                {task.guidance}
              </p>
            </div>

            {/* Expected Output */}
            <div>
              <h3 className="mb-2 text-sm font-medium text-blue-900">
                Expected Output
              </h3>
              <CodeBlock code={task.expectedOutput} />
            </div>

            {/* Completion Checkbox */}
            <div className="flex items-center gap-3 rounded-xl bg-blue-100/50 p-4">
              <Checkbox
                id="app-complete"
                checked={completed}
                onCheckedChange={(checked) =>
                  handleCompletedChange(checked as boolean)
                }
                disabled={disabled}
                className="h-5 w-5 border-blue-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label
                htmlFor="app-complete"
                className="flex cursor-pointer items-center gap-2 text-sm font-medium text-blue-800"
              >
                {completed && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                I completed this application
              </label>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}
