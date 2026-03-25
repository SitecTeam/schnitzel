import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Remove any locked-document relations pointing to pages
  await db.run(
    sql`DELETE FROM \`payload_locked_documents_rels\` WHERE \`pages_id\` IS NOT NULL;`
  );

  // D1/SQLite doesn't reliably support DROP COLUMN — leave the orphaned
  // pages_id column in payload_locked_documents_rels (it will stay NULL
  // forever since the collection is removed from the Payload config).

  // Drop the pages table and its indexes
  await db.run(sql`DROP TABLE IF EXISTS \`pages\`;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Recreate the pages table
  await db.run(sql`CREATE TABLE IF NOT EXISTS \`pages\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text NOT NULL,
    \`slug\` text NOT NULL,
    \`content\` text,
    \`featured_image_id\` integer,
    \`status\` text DEFAULT 'draft',
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );`);

  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`pages_slug_idx\` ON \`pages\` (\`slug\`);`
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`pages_featured_image_idx\` ON \`pages\` (\`featured_image_id\`);`
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`
  );
  await db.run(
    sql`CREATE INDEX IF NOT EXISTS \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`
  );

  // Re-add the pages_id column to locked_documents_rels
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`pages_id\` integer REFERENCES \`pages\`(\`id\`) ON DELETE CASCADE;`
  );
}
