/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  // Runtime var from wrangler.json — preferred, always correct for the deployed env.
  readonly PAYLOAD_API_URL: string;
  // Build-time fallback used in local dev (set via .env file).
  readonly PUBLIC_PAYLOAD_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
