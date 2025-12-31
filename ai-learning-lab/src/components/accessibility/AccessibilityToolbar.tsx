"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Settings,
  Sun,
  Moon,
  Contrast,
  Zap,
  Focus,
  RotateCcw,
  X,
} from "lucide-react";
import {
  useAccessibility,
  Theme,
  FontType,
  TextSize,
  Spacing,
} from "@/hooks/useAccessibility";

interface ButtonOption<T> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

function AccessibilityToolbarContent() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const {
    settings,
    isLoaded,
    setTheme,
    setFont,
    setTextSize,
    setSpacing,
    toggleReducedMotion,
    toggleFocusMode,
    resetToDefaults,
  } = useAccessibility();

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  if (!isLoaded) {
    return (
      <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--bg-elevated)]" />
    );
  }

  const themeOptions: ButtonOption<Theme>[] = [
    { value: "dark", label: "dark", icon: <Moon className="h-3.5 w-3.5" /> },
    { value: "light", label: "light", icon: <Sun className="h-3.5 w-3.5" /> },
    { value: "contrast", label: "high", icon: <Contrast className="h-3.5 w-3.5" /> },
  ];

  const fontOptions: ButtonOption<FontType>[] = [
    { value: "default", label: "default" },
    { value: "dyslexic", label: "dyslexic" },
    { value: "mono", label: "mono" },
  ];

  const textSizeOptions: ButtonOption<TextSize>[] = [
    { value: "small", label: "s" },
    { value: "medium", label: "m" },
    { value: "large", label: "l" },
    { value: "xlarge", label: "xl" },
  ];

  const spacingOptions: ButtonOption<Spacing>[] = [
    { value: "normal", label: "normal" },
    { value: "relaxed", label: "relaxed" },
    { value: "extra", label: "extra" },
  ];

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] bg-[var(--bg-elevated)] text-[var(--text-gray)] transition-all duration-200 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
        aria-label="Accessibility settings"
        aria-expanded={isOpen}
      >
        <Settings className="h-5 w-5" />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute right-0 top-12 z-50 w-72 origin-top-right rounded-xl border border-[rgba(255,255,255,0.1)] bg-[var(--bg-elevated)] p-4 shadow-2xl"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold lowercase tracking-wide text-[var(--text-white)]">
                accessibility
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-dark)] hover:text-[var(--text-white)]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Theme */}
            <div className="mb-4">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                theme
              </label>
              <div className="flex gap-2">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium lowercase transition-all duration-200 ${
                      settings.theme === option.value
                        ? "bg-[var(--accent-primary)] text-[var(--bg-dark)]"
                        : "bg-[var(--bg-dark)] text-[var(--text-gray)] hover:text-[var(--text-white)]"
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font */}
            <div className="mb-4">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                font
              </label>
              <div className="flex gap-2">
                {fontOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFont(option.value)}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium lowercase transition-all duration-200 ${
                      settings.font === option.value
                        ? "bg-[var(--accent-primary)] text-[var(--bg-dark)]"
                        : "bg-[var(--bg-dark)] text-[var(--text-gray)] hover:text-[var(--text-white)]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Size */}
            <div className="mb-4">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                text size
              </label>
              <div className="flex gap-2">
                {textSizeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTextSize(option.value)}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium uppercase transition-all duration-200 ${
                      settings.textSize === option.value
                        ? "bg-[var(--accent-primary)] text-[var(--bg-dark)]"
                        : "bg-[var(--bg-dark)] text-[var(--text-gray)] hover:text-[var(--text-white)]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Line Spacing */}
            <div className="mb-4">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                line spacing
              </label>
              <div className="flex gap-2">
                {spacingOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSpacing(option.value)}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium lowercase transition-all duration-200 ${
                      settings.spacing === option.value
                        ? "bg-[var(--accent-primary)] text-[var(--bg-dark)]"
                        : "bg-[var(--bg-dark)] text-[var(--text-gray)] hover:text-[var(--text-white)]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="mb-4 space-y-2">
              {/* Reduce Motion */}
              <button
                onClick={toggleReducedMotion}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium lowercase transition-all duration-200 ${
                  settings.reducedMotion
                    ? "bg-[var(--accent-primary)] text-[var(--bg-dark)]"
                    : "bg-[var(--bg-dark)] text-[var(--text-gray)] hover:text-[var(--text-white)]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" />
                  reduce motion
                </span>
                <span className="text-[10px] uppercase opacity-70">
                  {settings.reducedMotion ? "on" : "off"}
                </span>
              </button>

              {/* Focus Mode */}
              <button
                onClick={toggleFocusMode}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium lowercase transition-all duration-200 ${
                  settings.focusMode
                    ? "bg-[var(--accent-primary)] text-[var(--bg-dark)]"
                    : "bg-[var(--bg-dark)] text-[var(--text-gray)] hover:text-[var(--text-white)]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Focus className="h-3.5 w-3.5" />
                  focus mode
                </span>
                <span className="text-[10px] uppercase opacity-70">
                  {settings.focusMode ? "on" : "off"}
                </span>
              </button>
            </div>

            {/* Reset */}
            <button
              onClick={resetToDefaults}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[rgba(255,255,255,0.1)] px-3 py-2.5 text-xs font-medium lowercase text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--text-gray)] hover:text-[var(--text-white)]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              reset to defaults
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Placeholder shown during SSR and initial load
function AccessibilityToolbarPlaceholder() {
  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full border"
      style={{
        borderColor: "rgba(255, 255, 255, 0.1)",
        backgroundColor: "var(--bg-elevated)",
      }}
    >
      <Settings className="h-5 w-5" style={{ color: "var(--text-gray)" }} />
    </div>
  );
}

// Export with dynamic import to prevent SSR hydration issues
export const AccessibilityToolbar = dynamic(
  () => Promise.resolve(AccessibilityToolbarContent),
  {
    ssr: false,
    loading: () => <AccessibilityToolbarPlaceholder />,
  }
);
