"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AccessibilityConfirmationModal } from "@/components/accessibility/AccessibilityConfirmationModal";
import { AccessibilityToolbar } from "@/components/accessibility/AccessibilityToolbar";

interface DashboardClientWrapperProps {
  children: React.ReactNode;
}

export function DashboardClientWrapper({ children }: DashboardClientWrapperProps) {
  // Initialize scroll reveal for .reveal elements
  useScrollReveal();

  return (
    <>
      {/* Accessibility confirmation modal - shows once on first visit if preferences exist */}
      <AccessibilityConfirmationModal />

      {children}
    </>
  );
}

export { AccessibilityToolbar };
