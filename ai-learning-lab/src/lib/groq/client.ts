import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY environment variable is not set");
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const MODELS = {
  reasoning: "llama-3.3-70b-versatile", // For complex generation tasks
  fast: "llama-3.1-8b-instant", // For quick responses
};

// ========================================
// LOGGING UTILITY
// ========================================

type LogLevel = "info" | "warn" | "error" | "debug";

function log(level: LogLevel, message: string, data?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const prefix = `[Groq][${timestamp}]`;

  switch (level) {
    case "error":
      console.error(`${prefix} ERROR: ${message}`, data || "");
      break;
    case "warn":
      console.warn(`${prefix} WARN: ${message}`, data || "");
      break;
    case "debug":
      if (process.env.NODE_ENV === "development") {
        console.log(`${prefix} DEBUG: ${message}`, data || "");
      }
      break;
    default:
      console.log(`${prefix} INFO: ${message}`, data || "");
  }
}

// ========================================
// TIMEOUT WRAPPER
// ========================================

export class TimeoutError extends Error {
  constructor(message: string, public readonly timeoutMs: number) {
    super(message);
    this.name = "TimeoutError";
  }
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  operationName: string
): Promise<T> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new TimeoutError(
          `${operationName} timed out after ${timeoutMs / 1000} seconds. The AI is taking longer than expected. Please try again.`,
          timeoutMs
        )
      );
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

// ========================================
// API CALL OPTIONS
// ========================================

export interface GroqCallOptions {
  maxRetries?: number;
  timeoutMs?: number;
  operationName?: string;
}

const DEFAULT_OPTIONS: Required<GroqCallOptions> = {
  maxRetries: 3,
  timeoutMs: 60000, // 60 seconds default timeout
  operationName: "Groq API call",
};

// ========================================
// HELPER FUNCTION WITH RETRY AND TIMEOUT
// ========================================

export async function callGroqWithRetry<T>(
  apiCall: () => Promise<T>,
  options: GroqCallOptions = {}
): Promise<T> {
  const { maxRetries, timeoutMs, operationName } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  let lastError: Error | null = null;
  const startTime = Date.now();

  log("info", `Starting ${operationName}`, { maxRetries, timeoutMs });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      log("debug", `Attempt ${attempt}/${maxRetries} for ${operationName}`);

      const result = await withTimeout(apiCall(), timeoutMs, operationName);

      const duration = Date.now() - startTime;
      log("info", `${operationName} completed successfully`, {
        attempt,
        durationMs: duration,
      });

      return result;
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Log the error
      log("warn", `${operationName} failed on attempt ${attempt}`, {
        error: lastError.message,
        isTimeout: error instanceof TimeoutError,
      });

      // Don't retry on timeout errors - they indicate the operation is too slow
      if (error instanceof TimeoutError) {
        log("error", `${operationName} timed out`, { timeoutMs });
        throw error;
      }

      // Don't retry on 4xx errors (bad request, auth issues)
      const errorWithStatus = error as { status?: number };
      if (
        errorWithStatus.status &&
        errorWithStatus.status >= 400 &&
        errorWithStatus.status < 500
      ) {
        log("error", `${operationName} failed with client error`, {
          status: errorWithStatus.status,
        });
        throw error;
      }

      // Exponential backoff for 5xx and network errors
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        log("info", `Retrying ${operationName} in ${delay / 1000}s`, {
          attempt: attempt + 1,
          maxRetries,
        });
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  log("error", `${operationName} failed after all retries`, {
    maxRetries,
    totalDurationMs: Date.now() - startTime,
  });

  throw lastError;
}
