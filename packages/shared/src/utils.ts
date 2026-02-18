/**
 * Shared utility functions for Schnitzel.
 */

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  return new Date(dateString).toLocaleDateString("en-US", options);
}

/**
 * Build a full URL path, ensuring no double slashes.
 */
export function buildUrl(...segments: string[]): string {
  return segments
    .map((s, i) => {
      if (i === 0) return s.replace(/\/+$/, "");
      if (i === segments.length - 1) return s.replace(/^\/+/, "");
      return s.replace(/^\/+/, "").replace(/\/+$/, "");
    })
    .filter(Boolean)
    .join("/");
}

/**
 * Slugify a string for use in URLs.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
