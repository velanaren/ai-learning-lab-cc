"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

// ========================================
// VALIDATION SCHEMAS
// ========================================

const learningPreferencesSchema = z.object({
  dailyMinutes: z.number().min(10).max(60),
  weeklyHours: z.number().min(1).max(20),
  pacingPreference: z.enum(["auto", "ask"]),
});

const accessibilityPreferencesSchema = z.object({
  preferredFormats: z.array(z.string()),
  contentOrder: z.enum(["tldr-first", "details-first", "example-first"]),
  uiToggles: z.array(z.string()),
});

const applicationSettingsSchema = z.object({
  applicationFrequency: z.enum(["low", "some", "high"]),
  trackingPreference: z.enum(["learning-only", "with-applications", "with-evidence"]),
});

// ========================================
// TYPES
// ========================================

type ActionResult = { success: true } | { success: false; error: string };

// ========================================
// SERVER ACTIONS
// ========================================

export async function updateLearningPreferences(
  data: z.infer<typeof learningPreferencesSchema>
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const validated = learningPreferencesSchema.parse(data);

    await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        dailyMinutes: validated.dailyMinutes,
        weeklyHours: validated.weeklyHours,
        missedDayBehavior: validated.pacingPreference === "auto"
          ? "slow down automatically"
          : "ask before adjusting",
      },
      create: {
        userId: user.id,
        dailyMinutes: validated.dailyMinutes,
        weeklyHours: validated.weeklyHours,
        missedDayBehavior: validated.pacingPreference === "auto"
          ? "slow down automatically"
          : "ask before adjusting",
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input" };
    }
    console.error("Failed to update learning preferences:", error);
    return { success: false, error: "Failed to update preferences" };
  }
}

export async function updateAccessibilityPreferences(
  data: z.infer<typeof accessibilityPreferencesSchema>
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const validated = accessibilityPreferencesSchema.parse(data);

    await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        preferredFormats: validated.preferredFormats,
        contentOrder: validated.contentOrder,
        uiToggles: validated.uiToggles,
      },
      create: {
        userId: user.id,
        preferredFormats: validated.preferredFormats,
        contentOrder: validated.contentOrder,
        uiToggles: validated.uiToggles,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input" };
    }
    console.error("Failed to update accessibility preferences:", error);
    return { success: false, error: "Failed to update preferences" };
  }
}

export async function updateApplicationSettings(
  data: z.infer<typeof applicationSettingsSchema>
): Promise<ActionResult> {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const validated = applicationSettingsSchema.parse(data);

    await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        trackingPreference: validated.trackingPreference,
        proofOfWorkImportance: validated.applicationFrequency === "high"
          ? "very important"
          : validated.applicationFrequency === "some"
            ? "important"
            : "nice-to-have",
      },
      create: {
        userId: user.id,
        trackingPreference: validated.trackingPreference,
        proofOfWorkImportance: validated.applicationFrequency === "high"
          ? "very important"
          : validated.applicationFrequency === "some"
            ? "important"
            : "nice-to-have",
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid input" };
    }
    console.error("Failed to update application settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
