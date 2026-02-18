/**
 * Drizzle ORM schema for Cloudflare D1.
 *
 * Define your custom tables here. Payload CMS manages its own internal
 * tables (users, media, pages, etc.) — only add app-specific tables here
 * that you want to query directly with Drizzle outside of Payload.
 *
 * Example:
 *
 * import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
 *
 * export const posts = sqliteTable("posts", {
 *   id: integer("id").primaryKey({ autoIncrement: true }),
 *   title: text("title").notNull(),
 *   slug: text("slug").notNull().unique(),
 *   createdAt: text("created_at")
 *     .notNull()
 *     .$defaultFn(() => new Date().toISOString()),
 * });
 */

// Export your tables here
export {};
