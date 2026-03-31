/**
 * Copies the Payload-generated types from apps/cms to the shared package
 * so every app in the monorepo uses the same type definitions.
 *
 * Run via:  bun run generate:types  (from the repo root)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "apps/cms/src/payload-types.ts");
const dest = join(root, "packages/shared/src/payload-types.ts");

let content = readFileSync(src, "utf8");
// Strip the Payload module augmentation — not needed outside the CMS app
content = content.replace(/\ndeclare module 'payload' \{[\s\S]*?\}\s*$/m, "\n");
writeFileSync(dest, content);
console.log("✓ Synced payload-types: apps/cms → packages/shared");
