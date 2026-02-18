/**
 * Augment the CloudflareEnv interface from @opennextjs/cloudflare
 * with our custom D1 and R2 bindings defined in wrangler.json.
 *
 * Regenerate worker-configuration.d.ts with: npx wrangler types
 */
interface CloudflareEnv {
  D1: D1Database;
  R2: R2Bucket;
  PAYLOAD_SECRET: string;
}
