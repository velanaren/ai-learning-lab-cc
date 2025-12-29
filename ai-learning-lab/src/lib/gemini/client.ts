import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// ========================================
// MODEL CONFIGURATION
// ========================================

export const MODELS = {
  // Primary model for all content generation
  primary: "gemini-2.0-flash-exp",
  // Fallback if needed
  fallback: "gemini-1.5-flash",
};

// Lazy initialization of the Gemini client
let _genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY environment variable is not set");
    }
    _genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }
  return _genAI;
}

// Get model instance with configuration
export function getModel(modelName: string = MODELS.primary): GenerativeModel {
  return getGenAI().getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
    },
  });
}

// ========================================
// LOGGING UTILITY
// ========================================

type LogLevel = "info" | "warn" | "error" | "debug";

function log(level: LogLevel, message: string, data?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const prefix = `[Gemini][${timestamp}]`;

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

export interface GeminiCallOptions {
  maxRetries?: number;
  timeoutMs?: number;
  operationName?: string;
  temperature?: number;
}

const DEFAULT_OPTIONS: Required<Omit<GeminiCallOptions, "temperature">> = {
  maxRetries: 3,
  timeoutMs: 90000, // 90 seconds default timeout (Gemini can be slower for complex prompts)
  operationName: "Gemini API call",
};

// ========================================
// MAIN GENERATION FUNCTION
// ========================================

export interface GenerateContentOptions extends GeminiCallOptions {
  prompt: string;
  systemInstruction?: string;
}

export async function generateContent(
  options: GenerateContentOptions
): Promise<string> {
  const { prompt, systemInstruction, temperature, ...callOptions } = options;
  const { maxRetries, timeoutMs, operationName } = {
    ...DEFAULT_OPTIONS,
    ...callOptions,
  };

  let lastError: Error | null = null;
  const startTime = Date.now();

  log("info", `Starting ${operationName}`, { maxRetries, timeoutMs });

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      log("debug", `Attempt ${attempt}/${maxRetries} for ${operationName}`);

      const model = getGenAI().getGenerativeModel({
        model: MODELS.primary,
        generationConfig: {
          temperature: temperature ?? 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        },
        systemInstruction: systemInstruction,
      });

      const result = await withTimeout(
        model.generateContent(prompt),
        timeoutMs,
        operationName
      );

      const response = result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error("Empty response from Gemini");
      }

      const duration = Date.now() - startTime;
      log("info", `${operationName} completed successfully`, {
        attempt,
        durationMs: duration,
        responseLength: text.length,
      });

      return text;
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));

      log("warn", `${operationName} failed on attempt ${attempt}`, {
        error: lastError.message,
        isTimeout: error instanceof TimeoutError,
      });

      // Don't retry on timeout errors
      if (error instanceof TimeoutError) {
        log("error", `${operationName} timed out`, { timeoutMs });
        throw error;
      }

      // Check for specific Gemini error types
      const errorMessage = lastError.message.toLowerCase();

      // Don't retry on authentication or quota errors
      if (
        errorMessage.includes("api key") ||
        errorMessage.includes("quota") ||
        errorMessage.includes("permission")
      ) {
        log("error", `${operationName} failed with auth/quota error`, {
          error: lastError.message,
        });
        throw error;
      }

      // Don't retry on safety/content filter blocks
      if (
        errorMessage.includes("safety") ||
        errorMessage.includes("blocked") ||
        errorMessage.includes("filter")
      ) {
        log("error", `${operationName} blocked by safety filter`, {
          error: lastError.message,
        });
        throw error;
      }

      // Exponential backoff for other errors
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

// ========================================
// JSON GENERATION HELPER
// ========================================

export async function generateJSON<T>(
  options: GenerateContentOptions
): Promise<T> {
  const text = await generateContent(options);

  // Clean up the response - remove markdown code blocks if present
  let cleanedText = text.trim();

  // Remove ```json and ``` markers
  if (cleanedText.startsWith("```json")) {
    cleanedText = cleanedText.slice(7);
  } else if (cleanedText.startsWith("```")) {
    cleanedText = cleanedText.slice(3);
  }

  if (cleanedText.endsWith("```")) {
    cleanedText = cleanedText.slice(0, -3);
  }

  cleanedText = cleanedText.trim();

  try {
    return JSON.parse(cleanedText) as T;
  } catch (parseError) {
    log("error", "Failed to parse JSON response", {
      error: parseError instanceof Error ? parseError.message : String(parseError),
      responsePreview: cleanedText.slice(0, 500),
    });

    // Try to extract JSON from the response
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as T;
      } catch {
        // Fall through to throw
      }
    }

    throw new Error(
      `Failed to parse JSON response from Gemini: ${parseError instanceof Error ? parseError.message : String(parseError)}`
    );
  }
}
