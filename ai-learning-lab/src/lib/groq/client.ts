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

// Helper function with retry logic
export async function callGroqWithRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on 4xx errors (bad request, auth issues)
      const errorWithStatus = error as { status?: number };
      if (
        errorWithStatus.status &&
        errorWithStatus.status >= 400 &&
        errorWithStatus.status < 500
      ) {
        throw error;
      }

      // Exponential backoff for 5xx and network errors
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        await new Promise((resolve) => setTimeout(resolve, delay));
        console.log(
          `Retrying Groq API call (attempt ${attempt + 1}/${maxRetries})`
        );
      }
    }
  }

  throw lastError;
}
