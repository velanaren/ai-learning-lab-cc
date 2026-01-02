"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Check, RotateCcw } from "lucide-react";

const STORAGE_KEYS = {
  confirmed: "a11y-confirmed",
  theme: "a11y-theme",
  font: "a11y-font",
  textSize: "a11y-textsize",
  spacing: "a11y-spacing",
  reducedMotion: "a11y-reduced-motion",
  focusMode: "a11y-focus-mode",
} as const;

interface AccessibilityConfirmationModalProps {
  onConfirm?: () => void;
}

export function AccessibilityConfirmationModal({
  onConfirm,
}: AccessibilityConfirmationModalProps) {
  const [showModal, setShowModal] = useState(false);
  const [hasPreferences, setHasPreferences] = useState(false);
  const [preferences, setPreferences] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check if already confirmed
    const isConfirmed = localStorage.getItem(STORAGE_KEYS.confirmed) === "true";
    if (isConfirmed) {
      return;
    }

    // Check if any accessibility preferences exist
    const theme = localStorage.getItem(STORAGE_KEYS.theme);
    const font = localStorage.getItem(STORAGE_KEYS.font);
    const textSize = localStorage.getItem(STORAGE_KEYS.textSize);
    const spacing = localStorage.getItem(STORAGE_KEYS.spacing);
    const reducedMotion = localStorage.getItem(STORAGE_KEYS.reducedMotion);
    const focusMode = localStorage.getItem(STORAGE_KEYS.focusMode);

    // Check if any non-default preferences are set
    const hasNonDefaultPrefs =
      (theme && theme !== "dark") ||
      (font && font !== "default") ||
      (textSize && textSize !== "medium") ||
      (spacing && spacing !== "normal") ||
      reducedMotion === "true" ||
      focusMode === "true";

    if (hasNonDefaultPrefs) {
      setHasPreferences(true);
      setPreferences({
        theme: theme || "dark",
        font: font || "default",
        textSize: textSize || "medium",
        spacing: spacing || "normal",
        reducedMotion: reducedMotion || "false",
        focusMode: focusMode || "false",
      });
      setShowModal(true);
    } else {
      // No preferences to confirm, mark as confirmed
      localStorage.setItem(STORAGE_KEYS.confirmed, "true");
    }
  }, []);

  const handleKeepSettings = () => {
    localStorage.setItem(STORAGE_KEYS.confirmed, "true");
    setShowModal(false);
    onConfirm?.();
  };

  const handleResetDefaults = () => {
    // Reset all accessibility settings
    localStorage.removeItem(STORAGE_KEYS.theme);
    localStorage.removeItem(STORAGE_KEYS.font);
    localStorage.removeItem(STORAGE_KEYS.textSize);
    localStorage.removeItem(STORAGE_KEYS.spacing);
    localStorage.removeItem(STORAGE_KEYS.reducedMotion);
    localStorage.removeItem(STORAGE_KEYS.focusMode);
    localStorage.setItem(STORAGE_KEYS.confirmed, "true");

    // Remove classes from body
    const body = document.body;
    body.classList.remove(
      "theme-light",
      "theme-contrast",
      "font-dyslexic",
      "font-mono",
      "text-small",
      "text-large",
      "text-xlarge",
      "spacing-relaxed",
      "spacing-extra",
      "reduced-motion",
      "focus-mode"
    );
    body.classList.add("text-medium", "spacing-normal");

    setShowModal(false);
    onConfirm?.();
  };

  const formatPreference = (key: string, value: string): string => {
    switch (key) {
      case "theme":
        return `theme: ${value}`;
      case "font":
        return `font: ${value}`;
      case "textSize":
        return `text size: ${value}`;
      case "spacing":
        return `line spacing: ${value}`;
      case "reducedMotion":
        return value === "true" ? "reduced motion: on" : "";
      case "focusMode":
        return value === "true" ? "focus mode: on" : "";
      default:
        return "";
    }
  };

  const activePreferences = Object.entries(preferences)
    .map(([key, value]) => formatPreference(key, value))
    .filter((pref) => pref !== "" && !pref.includes(": dark") && !pref.includes(": default") && !pref.includes(": medium") && !pref.includes(": normal"));

  if (!showModal || !hasPreferences) {
    return null;
  }

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleKeepSettings}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[var(--bg-elevated)] p-6 shadow-2xl"
          >
            {/* Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-glow)]">
              <Settings className="h-6 w-6 text-[var(--accent-primary)]" />
            </div>

            {/* Title */}
            <h2 className="mb-2 text-xl font-semibold lowercase text-[var(--text-white)]">
              accessibility preferences detected
            </h2>

            {/* Description */}
            <p className="mb-4 text-sm lowercase text-[var(--text-gray)]">
              we noticed you have saved accessibility preferences. would you like to keep these settings?
            </p>

            {/* Preferences list */}
            {activePreferences.length > 0 && (
              <div className="mb-6 rounded-lg bg-[var(--bg-dark)] p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                  current settings
                </p>
                <ul className="space-y-1">
                  {activePreferences.map((pref, index) => (
                    <li
                      key={index}
                      className="text-sm lowercase text-[var(--text-white)]"
                    >
                      • {pref}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleResetDefaults}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[rgba(255,255,255,0.1)] px-4 py-3 text-sm font-medium lowercase text-[var(--text-gray)] transition-all duration-200 hover:border-[var(--text-gray)] hover:text-[var(--text-white)]"
              >
                <RotateCcw className="h-4 w-4" />
                reset to defaults
              </button>
              <button
                onClick={handleKeepSettings}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-3 text-sm font-medium lowercase text-[var(--bg-dark)] transition-all duration-200 hover:bg-[var(--accent-hover)]"
              >
                <Check className="h-4 w-4" />
                keep my settings
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
