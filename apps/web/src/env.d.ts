/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly PUBLIC_PAYLOAD_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
