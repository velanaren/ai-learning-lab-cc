"use client";

import { useState, useEffect, useCallback } from "react";

export type Theme = "dark" | "light" | "contrast";
export type FontType = "default" | "dyslexic" | "mono";
export type TextSize = "small" | "medium" | "large" | "xlarge";
export type Spacing = "normal" | "relaxed" | "extra";

export interface AccessibilitySettings {
  theme: Theme;
  font: FontType;
  textSize: TextSize;
  spacing: Spacing;
  reducedMotion: boolean;
  focusMode: boolean;
}

const STORAGE_KEYS = {
  theme: "a11y-theme",
  font: "a11y-font",
  textSize: "a11y-textsize",
  spacing: "a11y-spacing",
  reducedMotion: "a11y-reduced-motion",
  focusMode: "a11y-focus-mode",
} as const;

const DEFAULT_SETTINGS: AccessibilitySettings = {
  theme: "dark",
  font: "default",
  textSize: "medium",
  spacing: "normal",
  reducedMotion: false,
  focusMode: false,
};

function getStoredSettings(): AccessibilitySettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  return {
    theme: (localStorage.getItem(STORAGE_KEYS.theme) as Theme) || DEFAULT_SETTINGS.theme,
    font: (localStorage.getItem(STORAGE_KEYS.font) as FontType) || DEFAULT_SETTINGS.font,
    textSize: (localStorage.getItem(STORAGE_KEYS.textSize) as TextSize) || DEFAULT_SETTINGS.textSize,
    spacing: (localStorage.getItem(STORAGE_KEYS.spacing) as Spacing) || DEFAULT_SETTINGS.spacing,
    reducedMotion: localStorage.getItem(STORAGE_KEYS.reducedMotion) === "true",
    focusMode: localStorage.getItem(STORAGE_KEYS.focusMode) === "true",
  };
}

function applySettingsToBody(settings: AccessibilitySettings) {
  if (typeof document === "undefined") return;

  const body = document.body;

  // Remove all theme classes and apply current
  body.classList.remove("theme-dark", "theme-light", "theme-contrast");
  if (settings.theme !== "dark") {
    body.classList.add(`theme-${settings.theme}`);
  }

  // Remove all font classes and apply current
  body.classList.remove("font-default", "font-dyslexic", "font-mono");
  if (settings.font !== "default") {
    body.classList.add(`font-${settings.font}`);
  }

  // Remove all text size classes and apply current
  body.classList.remove("text-small", "text-medium", "text-large", "text-xlarge");
  body.classList.add(`text-${settings.textSize}`);

  // Remove all spacing classes and apply current
  body.classList.remove("spacing-normal", "spacing-relaxed", "spacing-extra");
  body.classList.add(`spacing-${settings.spacing}`);

  // Toggle reduced motion
  body.classList.toggle("reduced-motion", settings.reducedMotion);

  // Toggle focus mode
  body.classList.toggle("focus-mode", settings.focusMode);
}

function saveSettingsToStorage(settings: AccessibilitySettings) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEYS.theme, settings.theme);
  localStorage.setItem(STORAGE_KEYS.font, settings.font);
  localStorage.setItem(STORAGE_KEYS.textSize, settings.textSize);
  localStorage.setItem(STORAGE_KEYS.spacing, settings.spacing);
  localStorage.setItem(STORAGE_KEYS.reducedMotion, String(settings.reducedMotion));
  localStorage.setItem(STORAGE_KEYS.focusMode, String(settings.focusMode));
}

export function useAccessibility() {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const stored = getStoredSettings();
    setSettings(stored);
    applySettingsToBody(stored);
    setIsLoaded(true);
  }, []);

  // Apply settings whenever they change
  useEffect(() => {
    if (isLoaded) {
      applySettingsToBody(settings);
      saveSettingsToStorage(settings);
    }
  }, [settings, isLoaded]);

  const updateSettings = useCallback((updates: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    updateSettings({ theme });
  }, [updateSettings]);

  const setFont = useCallback((font: FontType) => {
    updateSettings({ font });
  }, [updateSettings]);

  const setTextSize = useCallback((textSize: TextSize) => {
    updateSettings({ textSize });
  }, [updateSettings]);

  const setSpacing = useCallback((spacing: Spacing) => {
    updateSettings({ spacing });
  }, [updateSettings]);

  const toggleReducedMotion = useCallback(() => {
    setSettings((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  }, []);

  const toggleFocusMode = useCallback(() => {
    setSettings((prev) => ({ ...prev, focusMode: !prev.focusMode }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    // Clear localStorage
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }, []);

  return {
    settings,
    isLoaded,
    setTheme,
    setFont,
    setTextSize,
    setSpacing,
    toggleReducedMotion,
    toggleFocusMode,
    resetToDefaults,
    updateSettings,
  };
}

// Script to run in head to prevent flash of unstyled content
export const accessibilityInitScript = `
(function() {
  try {
    var theme = localStorage.getItem('a11y-theme') || 'dark';
    var font = localStorage.getItem('a11y-font') || 'default';
    var textSize = localStorage.getItem('a11y-textsize') || 'medium';
    var spacing = localStorage.getItem('a11y-spacing') || 'normal';
    var reducedMotion = localStorage.getItem('a11y-reduced-motion') === 'true';
    var focusMode = localStorage.getItem('a11y-focus-mode') === 'true';

    var classes = [];
    if (theme !== 'dark') classes.push('theme-' + theme);
    if (font !== 'default') classes.push('font-' + font);
    classes.push('text-' + textSize);
    classes.push('spacing-' + spacing);
    if (reducedMotion) classes.push('reduced-motion');
    if (focusMode) classes.push('focus-mode');

    document.documentElement.className = classes.join(' ');
  } catch (e) {}
})();
`;
