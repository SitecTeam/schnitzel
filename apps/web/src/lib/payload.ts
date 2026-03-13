/**
 * Payload CMS API client for the Astro frontend.
 *
 * Wraps fetch() calls to the Payload REST API.
 * In production, the CMS is on the same domain under /api.
 * In dev, it runs on localhost:3000.
 */

import type { PayloadListResponse, Episode } from "@schnitzel/shared";

const PAYLOAD_API_URL =
  // Runtime wrangler var (Cloudflare Workers) — set in wrangler.json or via --var at deploy time.
  import.meta.env.PAYLOAD_API_URL ??
  // Build-time var — set in .env for local dev.
  import.meta.env.PUBLIC_PAYLOAD_API_URL ??
  "http://localhost:3000/api";
const EPISODES_CACHE_TTL_MS = 30_000;

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

type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const responseCache = new Map<string, CacheEntry<unknown>>();
const inflightRequests = new Map<string, Promise<unknown>>();

function getCachedResponse<T>(key: string): T | null {
  const entry = responseCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    responseCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCachedResponse<T>(key: string, data: T, ttlMs: number): void {
  responseCache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

function getInflightRequest<T>(key: string): Promise<T> | null {
  return (inflightRequests.get(key) as Promise<T> | undefined) ?? null;
}

function setInflightRequest<T>(key: string, request: Promise<T>): void {
  inflightRequests.set(key, request as Promise<unknown>);
}

function clearInflightRequest(key: string): void {
  inflightRequests.delete(key);
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
  const { search, sort = "-episodeNumber", page = 1, limit = 12 } = options;

  const parts: string[] = [
    "where[status][equals]=published",
    `sort=${encodeURIComponent(sort)}`,
    "depth=1",
    "select[episodeNumber]=true",
    "select[title]=true",
    "select[slug]=true",
    "select[guestName]=true",
    "select[description]=true",
    "select[coverImage]=true",
    "select[publishedAt]=true",
    "select[audioUrl]=true",
    "select[status]=true",
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

  const cached = getCachedResponse<PayloadListResponse<Episode>>(url);
  if (cached) return cached;

  const inflight = getInflightRequest<PayloadListResponse<Episode>>(url);
  if (inflight) return inflight;

  const request = (async () => {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `Payload API error: ${response.status} ${response.statusText}`
      );
    }

    const data: PayloadListResponse<Episode> = await response.json();
    setCachedResponse(url, data, EPISODES_CACHE_TTL_MS);
    return data;
  })();

  setInflightRequest(url, request);

  try {
    return await request;
  } finally {
    clearInflightRequest(url);
  }
}

/**
 * Fetch a single episode by its slug.
 * Returns `null` when not found.
 */
export async function getEpisodeBySlug(slug: string): Promise<Episode | null> {
  const url = `${PAYLOAD_API_URL}/episodes?where[slug][equals]=${encodeURIComponent(slug)}&depth=1&limit=1`;

  const cached = getCachedResponse<PayloadListResponse<Episode>>(url);
  if (cached) return cached.docs[0] ?? null;

  const inflight = getInflightRequest<PayloadListResponse<Episode>>(url);
  if (inflight) {
    const data = await inflight;
    return data.docs[0] ?? null;
  }

  const request = (async () => {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) return null;

    const data: PayloadListResponse<Episode> = await response.json();
    setCachedResponse(url, data, EPISODES_CACHE_TTL_MS);
    return data;
  })();

  setInflightRequest(url, request);

  try {
    const data = await request;
    return data?.docs[0] ?? null;
  } finally {
    clearInflightRequest(url);
  }
}

/**
 * Fetch the previous and next published episodes relative to the given
 * episode number. Uses two targeted queries (limit=1 each) so it scales
 * to any number of episodes without fetching the full list.
 */
export async function getAdjacentEpisodes(episodeNumber: number): Promise<{
  prev: Episode | null;
  next: Episode | null;
}> {
  const [nextRes, prevRes] = await Promise.all([
    fetch(
      `${PAYLOAD_API_URL}/episodes?where[status][equals]=published&where[episodeNumber][greater_than]=${episodeNumber}&sort=episodeNumber&limit=1&depth=0`,
      { headers: { "Content-Type": "application/json" } }
    ),
    fetch(
      `${PAYLOAD_API_URL}/episodes?where[status][equals]=published&where[episodeNumber][less_than]=${episodeNumber}&sort=-episodeNumber&limit=1&depth=0`,
      { headers: { "Content-Type": "application/json" } }
    ),
  ]);

  const prevData: PayloadListResponse<Episode> = prevRes.ok
    ? await prevRes.json()
    : ({ docs: [] } as unknown as PayloadListResponse<Episode>);
  const nextData: PayloadListResponse<Episode> = nextRes.ok
    ? await nextRes.json()
    : ({ docs: [] } as unknown as PayloadListResponse<Episode>);

  return {
    prev: prevData.docs[0] ?? null,
    next: nextData.docs[0] ?? null,
  };
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
