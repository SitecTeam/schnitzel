/**
 * Payload CMS API client for the Astro frontend.
 *
 * Wraps fetch() calls to the Payload REST API.
 * In production, the CMS is on the same domain under /api.
 * In dev, it runs on localhost:3000.
 */

import type { PayloadListResponse, Episode } from "@schnitzel/shared";

const PAYLOAD_API_URL =
  import.meta.env.PUBLIC_PAYLOAD_API_URL ?? "http://localhost:3000/api";

// CMS server root (strips trailing /api so we can resolve relative media URLs)
const PAYLOAD_SERVER_URL = PAYLOAD_API_URL.replace(/\/api\/?$/, "");

/**
 * Resolve a Payload media URL to an absolute URL.
 * In dev the URL comes back as a relative path (/api/media/file/…)
 * because Payload doesn't know its public hostname until `serverURL` is set.
 * This helper ensures images always point at the CMS origin.
 */
export function resolveMediaUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${PAYLOAD_SERVER_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

interface PayloadRequestOptions {
  /** Query params for filtering, sorting, pagination */
  query?: Record<string, string | number | boolean>;
  /** Additional fetch options */
  fetchOptions?: RequestInit;
}

/**
 * Fetch a list of documents from a Payload collection.
 */
export async function getCollection<T = Record<string, unknown>>(
  collection: string,
  options: PayloadRequestOptions = {}
): Promise<PayloadListResponse<T>> {
  const url = new URL(`${PAYLOAD_API_URL}/${collection}`);

  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    ...options.fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...options.fetchOptions?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Payload API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Fetch a single document by ID from a Payload collection.
 */
export async function getDocument<T = Record<string, unknown>>(
  collection: string,
  id: string,
  options: PayloadRequestOptions = {}
): Promise<T> {
  const url = new URL(`${PAYLOAD_API_URL}/${collection}/${id}`);

  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    ...options.fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...options.fetchOptions?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Payload API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// Episodes helpers
// ---------------------------------------------------------------------------

interface GetEpisodesOptions {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch published episodes from the Payload REST API.
 *
 * Builds the where-clause query string manually (without URLSearchParams
 * encoding) so that Payload's qs-based parser sees literal bracket notation.
 */
export async function getEpisodes(
  options: GetEpisodesOptions = {}
): Promise<PayloadListResponse<Episode>> {
  const { search, sort = "-episodeNumber", page = 1, limit = 100 } = options;

  const parts: string[] = [
    "where[status][equals]=published",
    `sort=${encodeURIComponent(sort)}`,
    "depth=1",
    `limit=${limit}`,
    `page=${page}`,
  ];

  if (search?.trim()) {
    parts.push(
      `where[or][0][title][like]=${encodeURIComponent(search.trim())}`
    );
    parts.push(
      `where[or][1][guestName][like]=${encodeURIComponent(search.trim())}`
    );
  }

  const url = `${PAYLOAD_API_URL}/episodes?${parts.join("&")}`;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Payload API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Fetch a single episode by its slug.
 * Returns `null` when not found.
 */
export async function getEpisodeBySlug(slug: string): Promise<Episode | null> {
  const url = `${PAYLOAD_API_URL}/episodes?where[slug][equals]=${encodeURIComponent(slug)}&depth=1&limit=1`;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) return null;

  const data: PayloadListResponse<Episode> = await response.json();
  return data.docs[0] ?? null;
}

/**
 * Fetch a Payload global (e.g., site settings, nav).
 */
export async function getGlobal<T = Record<string, unknown>>(
  global: string,
  options: PayloadRequestOptions = {}
): Promise<T> {
  const url = new URL(`${PAYLOAD_API_URL}/globals/${global}`);

  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    ...options.fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...options.fetchOptions?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Payload API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
