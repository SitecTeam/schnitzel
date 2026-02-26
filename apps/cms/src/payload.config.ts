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
import { r2Storage } from "@payloadcms/storage-r2";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Episodes } from "./collections/Episodes";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const realpath = (value: string) =>
  fs.existsSync(value) ? fs.realpathSync(value) : undefined;

const isCLI = process.argv.some(value =>
  realpath(value)?.endsWith(path.join("payload", "bin.js"))
);
const isProduction = process.env.NODE_ENV === "production";
const cloudflareEnvironment = isProduction
  ? (process.env.CLOUDFLARE_ENV?.trim() ?? undefined)
  : undefined;

const cloudflare =
  isCLI || !isProduction
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

  collections: [Users, Media, Pages, Episodes],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-me-in-production",

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),

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
      remoteBindings:
        isProduction || process.env.CLOUDFLARE_REMOTE_BINDINGS === "true",
    } satisfies GetPlatformProxyOptions)
  );
}
