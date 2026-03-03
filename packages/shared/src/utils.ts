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
 * Format a date as day with ordinal suffix, month and year.
 * Example: 3rd September 2025
 */
export function formatDateWithOrdinal(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(date);

  const day = Number(parts.find(part => part.type === "day")?.value ?? 0);
  const month = parts.find(part => part.type === "month")?.value ?? "";
  const year = parts.find(part => part.type === "year")?.value ?? "";

  const suffix =
    day >= 11 && day <= 13
      ? "th"
      : (({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[day % 10] ??
        "th");

  return `${day}${suffix} ${month} ${year}`;
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
