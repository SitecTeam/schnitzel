/**
 * Shared types, utilities, and constants for the Schnitzel monorepo.
 *
 * Used by both @schnitzel/web (Astro frontend) and @schnitzel/cms (Payload CMS).
 */

export * from "./types";
export * from "./utils";

// Also re-export the raw generated file so CMS-internal code can reach
// all Payload types (PayloadKv, PayloadLockedDocument, etc.) if needed.
export * from "./payload-types";
