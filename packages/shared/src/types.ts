/**
 * Shared TypeScript types for Schnitzel.
 *
 * These types mirror the Payload CMS collections and can be
 * auto-generated from Payload in the future using `payload generate:types`.
 */

/** Base fields present on all Payload documents */
export interface PayloadDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/** User document */
export interface User extends PayloadDocument {
  email: string;
  name?: string;
}

/** Media document */
export interface Media extends PayloadDocument {
  alt: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
}

/** Page document */
export interface Page extends PayloadDocument {
  title: string;
  slug: string;
  content?: unknown; // Lexical rich text JSON
  featuredImage?: string | Media;
  status: "draft" | "published";
}

/** Generic Payload list response */
export interface PayloadListResponse<T> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
