"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { updateApplicationSettings } from "@/app/actions/update-preferences";

interface ApplicationSettingsFormProps {
  initialApplicationFrequency: "low" | "some" | "high";
  initialTrackingPreference: "learning-only" | "with-applications" | "with-evidence";
}

export function ApplicationSettingsForm({
  initialApplicationFrequency,
  initialTrackingPreference,
}: ApplicationSettingsFormProps) {
  const [applicationFrequency, setApplicationFrequency] = useState<"low" | "some" | "high">(
    initialApplicationFrequency
  );
  const [trackingPreference, setTrackingPreference] = useState<
    "learning-only" | "with-applications" | "with-evidence"
  >(initialTrackingPreference);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateApplicationSettings({
        applicationFrequency,
        trackingPreference,
      });

      if (result.success) {
        toast.success("Application settings updated");
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
        <Label className="mb-3 block text-sm font-medium text-zinc-700">
          Application frequency
        </Label>
        <p className="mb-3 text-xs text-zinc-500">
          How often should we include hands-on practice?
        </p>
        <RadioGroup
          value={applicationFrequency}
          onValueChange={(value) => setApplicationFrequency(value as typeof applicationFrequency)}
          className="space-y-2"
        >
          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50">
            <RadioGroupItem value="low" id="freq-low" className="mt-0.5" />
            <div>
              <Label htmlFor="freq-low" className="cursor-pointer text-sm font-medium text-zinc-900">
                Low
              </Label>
              <p className="text-xs text-zinc-500">Focus on concepts, occasional practice</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50">
            <RadioGroupItem value="some" id="freq-some" className="mt-0.5" />
            <div>
              <Label htmlFor="freq-some" className="cursor-pointer text-sm font-medium text-zinc-900">
                Some
              </Label>
              <p className="text-xs text-zinc-500">Balanced mix of learning and doing</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50">
            <RadioGroupItem value="high" id="freq-high" className="mt-0.5" />
            <div>
              <Label htmlFor="freq-high" className="cursor-pointer text-sm font-medium text-zinc-900">
                High
              </Label>
              <p className="text-xs text-zinc-500">Learn by doing, practice after every concept</p>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-medium text-zinc-700">
          Progress tracking
        </Label>
        <p className="mb-3 text-xs text-zinc-500">
          What would you like to track?
        </p>
        <RadioGroup
          value={trackingPreference}
          onValueChange={(value) => setTrackingPreference(value as typeof trackingPreference)}
          className="space-y-2"
        >
          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50">
            <RadioGroupItem value="learning-only" id="track-learning" className="mt-0.5" />
            <div>
              <Label htmlFor="track-learning" className="cursor-pointer text-sm font-medium text-zinc-900">
                Learning only
              </Label>
              <p className="text-xs text-zinc-500">Just track what you&apos;ve learned</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50">
            <RadioGroupItem value="with-applications" id="track-apps" className="mt-0.5" />
            <div>
              <Label htmlFor="track-apps" className="cursor-pointer text-sm font-medium text-zinc-900">
                Learning + Applications
              </Label>
              <p className="text-xs text-zinc-500">Track learning and what you&apos;ve applied</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50">
            <RadioGroupItem value="with-evidence" id="track-evidence" className="mt-0.5" />
            <div>
              <Label htmlFor="track-evidence" className="cursor-pointer text-sm font-medium text-zinc-900">
                Full evidence trail
              </Label>
              <p className="text-xs text-zinc-500">Include GitHub commits, screenshots, and other proof</p>
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
          "Save Settings"
        )}
      </Button>
    </div>
  );
}
