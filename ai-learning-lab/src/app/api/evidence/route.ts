import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/utils";
import { prisma } from "@/lib/db/prisma";
import { sanitizeAndLimit, sanitizeText } from "@/lib/utils/sanitize";

// ========================================
// CONSTANTS
// ========================================

const VALID_TYPES = [
  "github_commit",
  "github_pr",
  "github_file",
  "link",
  "screenshot",
  "code_snippet",
  "output",
] as const;

const VALID_SOURCE_TYPES = ["verifiable", "self_reported"] as const;

const URL_TYPES = ["link", "screenshot", "github_commit", "github_pr", "github_file"];

const CONTENT_LIMITS = {
  label: 200,
  url: 2000,
  code_snippet: 50000, // 50KB max for code
  output: 20000, // 20KB max for terminal output
};

// ========================================
// VALIDATION HELPERS
// ========================================

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateAndSanitizeContent(
  type: string,
  content: string,
  label: string | null
): { error?: string; sanitizedContent: string; sanitizedLabel: string | null } {
  // Sanitize label
  const sanitizedLabel = label ? sanitizeAndLimit(label, CONTENT_LIMITS.label) : null;

  // For URL types, validate the URL
  if (URL_TYPES.includes(type)) {
    const trimmedUrl = content.trim();

    if (!isValidUrl(trimmedUrl)) {
      return {
        error: "Please enter a valid URL starting with http:// or https://",
        sanitizedContent: "",
        sanitizedLabel: null,
      };
    }

    if (trimmedUrl.length > CONTENT_LIMITS.url) {
      return {
        error: `URL is too long. Maximum ${CONTENT_LIMITS.url} characters allowed.`,
        sanitizedContent: "",
        sanitizedLabel: null,
      };
    }

    // For URLs, we don't HTML-escape but we do trim
    return { sanitizedContent: trimmedUrl, sanitizedLabel };
  }

  // For code snippets
  if (type === "code_snippet") {
    if (content.length > CONTENT_LIMITS.code_snippet) {
      return {
        error: `Code snippet is too long. Maximum ${CONTENT_LIMITS.code_snippet.toLocaleString()} characters allowed.`,
        sanitizedContent: "",
        sanitizedLabel: null,
      };
    }
    // Sanitize to prevent XSS when displaying
    const sanitized = sanitizeText(content);
    return { sanitizedContent: sanitized || "", sanitizedLabel };
  }

  // For terminal output
  if (type === "output") {
    if (content.length > CONTENT_LIMITS.output) {
      return {
        error: `Terminal output is too long. Maximum ${CONTENT_LIMITS.output.toLocaleString()} characters allowed.`,
        sanitizedContent: "",
        sanitizedLabel: null,
      };
    }
    // Sanitize to prevent XSS when displaying
    const sanitized = sanitizeText(content);
    return { sanitizedContent: sanitized || "", sanitizedLabel };
  }

  // Default: sanitize and limit
  const sanitized = sanitizeAndLimit(content, CONTENT_LIMITS.url);
  return { sanitizedContent: sanitized || "", sanitizedLabel };
}

// ========================================
// ERROR MESSAGES
// ========================================

const ERROR_MESSAGES = {
  UNAUTHORIZED: "Please sign in to continue.",
  MISSING_FIELDS: "Please provide all required information.",
  INVALID_TYPE: "Invalid evidence type selected.",
  INVALID_SOURCE: "Invalid source type.",
  ENTRY_NOT_FOUND: "Learning entry not found. It may have been deleted.",
  EVIDENCE_NOT_FOUND: "Evidence not found. It may have been deleted.",
  ACCESS_DENIED: "You don't have permission to access this resource.",
  CREATE_FAILED: "Unable to save evidence. Please try again.",
  FETCH_FAILED: "Unable to load evidence. Please try again.",
  DELETE_FAILED: "Unable to delete evidence. Please try again.",
};

// ========================================
// POST /api/evidence - Create a new evidence item
// ========================================

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    const body = await request.json();
    const { memoryEntryId, type, urlOrBlobRef, label, sourceType } = body;

    // Validate required fields
    if (!memoryEntryId || !type || !urlOrBlobRef || !sourceType) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.MISSING_FIELDS },
        { status: 400 }
      );
    }

    // Validate evidence type
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_TYPE },
        { status: 400 }
      );
    }

    // Validate source type
    if (!VALID_SOURCE_TYPES.includes(sourceType)) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.INVALID_SOURCE },
        { status: 400 }
      );
    }

    // Validate and sanitize content
    const { error, sanitizedContent, sanitizedLabel } = validateAndSanitizeContent(
      type,
      urlOrBlobRef,
      label
    );

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // Verify the memory entry exists and belongs to the user
    const memoryEntry = await prisma.memoryEntry.findFirst({
      where: {
        id: memoryEntryId,
        userId: user.id,
      },
    });

    if (!memoryEntry) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.ENTRY_NOT_FOUND },
        { status: 404 }
      );
    }

    // Create the evidence item
    const evidenceItem = await prisma.evidenceItem.create({
      data: {
        memoryEntryId,
        type,
        urlOrBlobRef: sanitizedContent,
        label: sanitizedLabel,
        sourceType,
        visibility: "private",
      },
    });

    return NextResponse.json(evidenceItem, { status: 201 });
  } catch (error) {
    console.error("Error creating evidence item:", error);

    // Handle authentication errors
    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.CREATE_FAILED },
      { status: 500 }
    );
  }
}

// ========================================
// GET /api/evidence?memoryEntryId=xxx
// ========================================

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    const { searchParams } = new URL(request.url);
    const memoryEntryId = searchParams.get("memoryEntryId");

    if (!memoryEntryId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.MISSING_FIELDS },
        { status: 400 }
      );
    }

    // Verify the memory entry belongs to the user
    const memoryEntry = await prisma.memoryEntry.findFirst({
      where: {
        id: memoryEntryId,
        userId: user.id,
      },
    });

    if (!memoryEntry) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.ENTRY_NOT_FOUND },
        { status: 404 }
      );
    }

    // Get evidence items
    const evidenceItems = await prisma.evidenceItem.findMany({
      where: { memoryEntryId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(evidenceItems);
  } catch (error) {
    console.error("Error fetching evidence items:", error);

    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.FETCH_FAILED },
      { status: 500 }
    );
  }
}

// ========================================
// DELETE /api/evidence?id=xxx
// ========================================

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    const { searchParams } = new URL(request.url);
    const evidenceId = searchParams.get("id");

    if (!evidenceId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.MISSING_FIELDS },
        { status: 400 }
      );
    }

    // Find the evidence item and verify ownership through memory entry
    const evidenceItem = await prisma.evidenceItem.findFirst({
      where: { id: evidenceId },
      include: {
        memoryEntry: {
          select: { userId: true },
        },
      },
    });

    if (!evidenceItem) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.EVIDENCE_NOT_FOUND },
        { status: 404 }
      );
    }

    if (evidenceItem.memoryEntry.userId !== user.id) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.ACCESS_DENIED },
        { status: 403 }
      );
    }

    // Delete the evidence item
    await prisma.evidenceItem.delete({
      where: { id: evidenceId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting evidence item:", error);

    if (error instanceof Error && error.message === "Not authenticated") {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.DELETE_FAILED },
      { status: 500 }
    );
  }
}
