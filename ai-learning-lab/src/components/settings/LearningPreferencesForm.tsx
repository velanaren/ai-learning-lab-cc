"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { updateLearningPreferences } from "@/app/actions/update-preferences";

interface LearningPreferencesFormProps {
  initialDailyMinutes: number;
  initialWeeklyHours: number;
  initialPacingPreference: "auto" | "ask";
}

export function LearningPreferencesForm({
  initialDailyMinutes,
  initialWeeklyHours,
  initialPacingPreference,
}: LearningPreferencesFormProps) {
  const [dailyMinutes, setDailyMinutes] = useState(initialDailyMinutes);
  const [weeklyHours, setWeeklyHours] = useState(initialWeeklyHours);
  const [pacing, setPacing] = useState<"auto" | "ask">(initialPacingPreference);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateLearningPreferences({
        dailyMinutes,
        weeklyHours,
        pacingPreference: pacing,
      });

      if (result.success) {
        toast.success("Preferences updated successfully");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium text-zinc-700">
          Daily time budget: {dailyMinutes} minutes
        </Label>
        <p className="mb-3 text-xs text-zinc-500">
          How much time can you dedicate each day?
        </p>
        <Slider
          value={[dailyMinutes]}
          onValueChange={([value]) => setDailyMinutes(value)}
          min={10}
          max={60}
          step={5}
          className="w-full"
        />
        <div className="mt-1 flex justify-between text-xs text-zinc-400">
          <span>10 min</span>
          <span>60 min</span>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-zinc-700">
          Weekly commitment: {weeklyHours} hours
        </Label>
        <p className="mb-3 text-xs text-zinc-500">
          Total hours you can spend learning per week
        </p>
        <Slider
          value={[weeklyHours]}
          onValueChange={([value]) => setWeeklyHours(value)}
          min={1}
          max={20}
          step={1}
          className="w-full"
        />
        <div className="mt-1 flex justify-between text-xs text-zinc-400">
          <span>1 hour</span>
          <span>20 hours</span>
        </div>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-medium text-zinc-700">
          Pacing adjustment
        </Label>
        <RadioGroup
          value={pacing}
          onValueChange={(value) => setPacing(value as "auto" | "ask")}
          className="space-y-2"
        >
          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50">
            <RadioGroupItem value="auto" id="auto" className="mt-0.5" />
            <div>
              <Label htmlFor="auto" className="cursor-pointer text-sm font-medium text-zinc-900">
                Adapt automatically
              </Label>
              <p className="text-xs text-zinc-500">
                We&apos;ll adjust your pace based on your progress
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50">
            <RadioGroupItem value="ask" id="ask" className="mt-0.5" />
            <div>
              <Label htmlFor="ask" className="cursor-pointer text-sm font-medium text-zinc-900">
                Ask before adjusting
              </Label>
              <p className="text-xs text-zinc-500">
                We&apos;ll check with you before changing anything
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>

      <Button
        onClick={handleSave}
        disabled={loading}
        className="h-14 w-full rounded-2xl bg-zinc-900 text-base font-medium shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/25"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Preferences"
        )}
      </Button>
    </div>
  );
}
