/**
 * Payload CMS API client for the Astro frontend.
 *
 * Wraps fetch() calls to the Payload REST API.
 * In production, the CMS is on the same domain under /api.
 * In dev, it runs on localhost:3000.
 */

import type { PayloadListResponse } from "@schnitzel/shared";

const PAYLOAD_API_URL =
  import.meta.env.PUBLIC_PAYLOAD_API_URL ?? "http://localhost:3000/api";

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
