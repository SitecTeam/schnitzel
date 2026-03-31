import fs from "fs";
import path from "path";
import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import {
  CloudflareContext,
  getCloudflareContext,
} from "@opennextjs/cloudflare";
import type { GetPlatformProxyOptions } from "wrangler";
import type { Logger } from "pino";
import { r2Storage } from "@payloadcms/storage-r2";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Episodes } from "./collections/Episodes";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const wranglerConfigPath = path.resolve(dirname, "../wrangler.json");
const realpath = (value: string) =>
  fs.existsSync(value) ? fs.realpathSync(value) : undefined;

const isCLI = process.argv.some(value =>
  realpath(value)?.endsWith(path.join("payload", "bin.js"))
);
const isProduction = process.env.NODE_ENV === "production";
// During `next build`, Next.js sets NEXT_PHASE to 'phase-production-build'.
// In that phase it executes API routes to collect page data, but no real
// requests are served — so Cloudflare bindings are never actually called.
// Skipping the wrangler initialisation here prevents remote D1/R2 auth
// failures in CI where wrangler credentials are not present.
const isBuild = process.env.NEXT_PHASE === "phase-production-build";
const payloadSecret = process.env.PAYLOAD_SECRET?.trim();
const cloudflareEnvironment = isProduction
  ? (process.env.CLOUDFLARE_ENV?.trim() ?? undefined)
  : undefined;

if (isProduction && !payloadSecret) {
  throw new Error("PAYLOAD_SECRET must be set in production");
}

// pino-pretty uses Node.js fs APIs not available in Workers — route logs through
// console.* instead in production so Cloudflare observability picks them up.
const createLog =
  (level: string, fn: typeof console.log) =>
  (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === "string") {
      fn(JSON.stringify({ level, msg: objOrMsg }));
    } else {
      fn(
        JSON.stringify({
          level,
          ...objOrMsg,
          msg: msg ?? (objOrMsg as { msg?: string }).msg,
        })
      );
    }
  };

const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || "info",
  trace: createLog("trace", console.debug),
  debug: createLog("debug", console.debug),
  info: createLog("info", console.log),
  warn: createLog("warn", console.warn),
  error: createLog("error", console.error),
  fatal: createLog("fatal", console.error),
  silent: () => {},
} as unknown as Logger; // minimal implementation — Payload only calls log-level methods at runtime

const cloudflare = isBuild
  ? ({ env: {} } as unknown as CloudflareContext)
  : isCLI || !isProduction
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true });

export default buildConfig({
  serverURL:
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    (isProduction ? "" : "http://localhost:3000"),

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  collections: [Users, Media, Episodes],

  editor: lexicalEditor(),

  // Keep local/dev ergonomic while failing fast in production when missing.
  secret: payloadSecret || "dev-secret-change-me-in-production",

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  db: sqliteD1Adapter({ binding: cloudflare.env.D1, push: false }),

  // Use console-based logger in production — pino-pretty (default) calls
  // fs.write which is not available in Cloudflare Workers (workerd).
  logger: isProduction ? cloudflareLogger : undefined,

  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
});

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(
    /* webpackIgnore: true */ `${"__wrangler".replaceAll("_", "")}`
  ).then(({ getPlatformProxy }) =>
    getPlatformProxy({
      environment: cloudflareEnvironment,
      configPath: wranglerConfigPath,
      remoteBindings:
        isProduction || process.env.CLOUDFLARE_REMOTE_BINDINGS === "true",
    } satisfies GetPlatformProxyOptions)
  );
}
