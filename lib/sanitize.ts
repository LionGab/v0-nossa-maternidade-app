/**
 * Utility functions for sanitizing user input to prevent XSS attacks
 */

/**
 * Sanitizes a string by escaping HTML entities
 * This prevents XSS attacks by converting potentially dangerous characters
 *
 * @param input - The string to sanitize
 * @returns The sanitized string with HTML entities escaped
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") {
    return ""
  }

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

/**
 * Sanitizes an object recursively, sanitizing all string values
 * Useful for sanitizing request bodies or nested objects
 *
 * @param obj - The object to sanitize
 * @param maxDepth - Maximum recursion depth to prevent stack overflow (default: 10)
 * @returns A new object with all string values sanitized
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  maxDepth: number = 10
): T {
  if (maxDepth <= 0) {
    return obj
  }

  if (typeof obj !== "object" || obj === null) {
    return obj
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        return sanitizeString(item) as T
      }
      if (typeof item === "object" && item !== null) {
        return sanitizeObject(item as Record<string, unknown>, maxDepth - 1) as T
      }
      return item as T
    }) as T
  }

  // Handle objects
  const sanitized = {} as T
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      ;(sanitized as Record<string, unknown>)[key] = sanitizeString(value)
    } else if (typeof value === "object" && value !== null) {
      ;(sanitized as Record<string, unknown>)[key] = sanitizeObject(
        value as Record<string, unknown>,
        maxDepth - 1
      )
    } else {
      ;(sanitized as Record<string, unknown>)[key] = value
    }
  }

  return sanitized
}

/**
 * Sanitizes a message object for chat/conversation APIs
 * Specifically handles message content while preserving structure
 *
 * @param message - Message object with role and content
 * @returns Sanitized message object
 */
export function sanitizeMessage(message: { role: string; content: string }): {
  role: string
  content: string
} {
  return {
    role: message.role,
    content: sanitizeString(message.content),
  }
}

/**
 * Sanitizes an array of messages
 *
 * @param messages - Array of message objects
 * @returns Array of sanitized message objects
 */
export function sanitizeMessages(
  messages: Array<{ role: string; content: string }>
): Array<{ role: string; content: string }> {
  return messages.map(sanitizeMessage)
}

/**
 * Strips potential script tags and dangerous HTML from a string
 * More aggressive sanitization for user-generated content that will be stored
 *
 * @param input - The string to clean
 * @returns The cleaned string with script tags and dangerous HTML removed
 */
export function stripDangerousHTML(input: string): string {
  if (typeof input !== "string") {
    return ""
  }

  // Remove script tags and content
  let cleaned = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

  // Remove event handlers (onclick, onerror, etc.)
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "")

  // Remove javascript: protocol
  cleaned = cleaned.replace(/javascript:/gi, "")

  // Remove data: URLs that could be dangerous
  cleaned = cleaned.replace(/data:text\/html/gi, "")

  return sanitizeString(cleaned)
}

/**
 * Validates and sanitizes a URL string
 *
 * @param url - The URL string to validate and sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeURL(url: string): string {
  if (typeof url !== "string" || !url.trim()) {
    return ""
  }

  try {
    const parsed = new URL(url)
    // Only allow http and https protocols
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return ""
    }
    return parsed.toString()
  } catch {
    return ""
  }
}
