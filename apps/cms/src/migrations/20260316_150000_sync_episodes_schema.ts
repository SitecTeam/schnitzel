import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Add guest_name column (required field, but existing rows need a default)
  await db.run(
    sql`ALTER TABLE \`episodes\` ADD \`guest_name\` text NOT NULL DEFAULT '';`
  );
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  // SQLite doesn't support DROP COLUMN in older versions, but D1 does
  await db.run(sql`ALTER TABLE \`episodes\` DROP COLUMN \`guest_name\`;`);
}
