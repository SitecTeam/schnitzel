import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Rename podbean_url → audio_url
  await db.run(
    sql`ALTER TABLE \`episodes\` RENAME COLUMN \`podbean_url\` TO \`audio_url\`;`
  );
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
  await db.run(
    sql`ALTER TABLE \`episodes\` RENAME COLUMN \`audio_url\` TO \`podbean_url\`;`
  );
  // SQLite doesn't support DROP COLUMN in older versions, but D1 does
  await db.run(sql`ALTER TABLE \`episodes\` DROP COLUMN \`guest_name\`;`);
}
