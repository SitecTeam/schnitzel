import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`episodes_music\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`credit\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`episodes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`episodes_music_order_idx\` ON \`episodes_music\` (\`_order\`);`
  );
  await db.run(
    sql`CREATE INDEX \`episodes_music_parent_id_idx\` ON \`episodes_music\` (\`_parent_id\`);`
  );
  await db.run(sql`ALTER TABLE \`episodes\` DROP COLUMN \`music\`;`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`episodes_music\`;`);
  await db.run(sql`ALTER TABLE \`episodes\` ADD \`music\` text;`);
}
