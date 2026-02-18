import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./schema";

/**
 * Create a Drizzle client bound to the Cloudflare D1 instance.
 *
 * Usage in a Next.js/Payload route handler:
 *
 * ```ts
 * import { getCloudflareContext } from "@opennextjs/cloudflare";
 * import { createDb } from "@/db";
 *
 * const { env } = await getCloudflareContext({ async: true });
 * const db = createDb(env.D1);
 * const rows = await db.select().from(schema.posts);
 * ```
 */
export function createDb(d1: DrizzleD1Database) {
  return drizzle(d1, { schema });
}

export type DrizzleDb = ReturnType<typeof createDb>;
export { schema };
