"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { updateAccessibilityPreferences } from "@/app/actions/update-preferences";

interface AccessibilityFormProps {
  initialPreferredFormats: string[];
  initialContentOrder: "tldr-first" | "details-first" | "example-first";
  initialUiToggles: string[];
}

const formatOptions = [
  { id: "text-first", label: "Text-first explanations", description: "Prefer written content over other formats" },
  { id: "diagrams", label: "Diagrams & visuals", description: "Include visual aids and illustrations" },
  { id: "short-clips", label: "Short clips (3 min max)", description: "Brief video explanations when helpful" },
  { id: "no-videos", label: "No videos", description: "Skip all video content entirely" },
];

const uiToggleOptions = [
  { id: "focus-mode", label: "Focus Mode", description: "Hide distractions during learning" },
  { id: "reduced-motion", label: "Reduced motion", description: "Minimize animations" },
  { id: "larger-text", label: "Larger text", description: "Increase text size for readability" },
  { id: "high-contrast", label: "High contrast", description: "Enhanced color contrast" },
];

export function AccessibilityForm({
  initialPreferredFormats,
  initialContentOrder,
  initialUiToggles,
}: AccessibilityFormProps) {
  const [preferredFormats, setPreferredFormats] = useState<string[]>(initialPreferredFormats);
  const [contentOrder, setContentOrder] = useState<"tldr-first" | "details-first" | "example-first">(initialContentOrder);
  const [uiToggles, setUiToggles] = useState<string[]>(initialUiToggles);
  const [loading, setLoading] = useState(false);

  const toggleFormat = (formatId: string) => {
    setPreferredFormats((prev) =>
      prev.includes(formatId)
        ? prev.filter((f) => f !== formatId)
        : [...prev, formatId]
    );
  };

  const toggleUiOption = (optionId: string) => {
    setUiToggles((prev) =>
      prev.includes(optionId)
        ? prev.filter((o) => o !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateAccessibilityPreferences({
        preferredFormats,
        contentOrder,
        uiToggles,
      });

      if (result.success) {
        toast.success("Accessibility preferences updated");
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
          Preferred formats
        </Label>
        <div className="space-y-2">
          {formatOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50"
            >
              <Checkbox
                id={option.id}
                checked={preferredFormats.includes(option.id)}
                onCheckedChange={() => toggleFormat(option.id)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor={option.id} className="cursor-pointer text-sm font-medium text-zinc-900">
                  {option.label}
                </Label>
                <p className="text-xs text-zinc-500">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-medium text-zinc-700">
          Content order preference
        </Label>
        <RadioGroup
          value={contentOrder}
          onValueChange={(value) => setContentOrder(value as typeof contentOrder)}
          className="space-y-2"
        >
          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50">
            <RadioGroupItem value="tldr-first" id="tldr-first" className="mt-0.5" />
            <div>
              <Label htmlFor="tldr-first" className="cursor-pointer text-sm font-medium text-zinc-900">
                TL;DR first
              </Label>
              <p className="text-xs text-zinc-500">Quick summary, then details</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50">
            <RadioGroupItem value="details-first" id="details-first" className="mt-0.5" />
            <div>
              <Label htmlFor="details-first" className="cursor-pointer text-sm font-medium text-zinc-900">
                Details first
              </Label>
              <p className="text-xs text-zinc-500">Full explanation before summary</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50">
            <RadioGroupItem value="example-first" id="example-first" className="mt-0.5" />
            <div>
              <Label htmlFor="example-first" className="cursor-pointer text-sm font-medium text-zinc-900">
                Example first
              </Label>
              <p className="text-xs text-zinc-500">Start with a concrete example</p>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-medium text-zinc-700">
          UI comfort settings
        </Label>
        <div className="space-y-2">
          {uiToggleOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50"
            >
              <Checkbox
                id={option.id}
                checked={uiToggles.includes(option.id)}
                onCheckedChange={() => toggleUiOption(option.id)}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor={option.id} className="cursor-pointer text-sm font-medium text-zinc-900">
                  {option.label}
                </Label>
                <p className="text-xs text-zinc-500">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
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
