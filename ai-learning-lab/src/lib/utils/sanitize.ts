/**
 * Sanitize user input to prevent XSS attacks
 * Escapes HTML special characters
 */
export function sanitizeText(input: string | null | undefined): string | null {
  if (!input) return null;

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

/**
 * Sanitize and limit text length
 */
export function sanitizeAndLimit(
  input: string | null | undefined,
  maxLength: number = 10000
): string | null {
  const sanitized = sanitizeText(input);
  if (!sanitized) return null;

  return sanitized.slice(0, maxLength);
}
