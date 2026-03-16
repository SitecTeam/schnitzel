/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly PUBLIC_PAYLOAD_API_URL: string;
  readonly PUBLIC_PAYLOAD_API_FALLBACK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Cloudflare Workers runtime bindings for the web worker
interface CloudflareEnv {
  /** Service binding to the schnitzel-cms Worker */
  CMS: Fetcher;
}

type Runtime = import("@astrojs/cloudflare").Runtime<CloudflareEnv>;

declare namespace App {
  interface Locals extends Runtime {
    /** Bound fetch to the CMS worker — falls back to global fetch in local dev */
    cmsFetcher: typeof fetch;
  }
}
