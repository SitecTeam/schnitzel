import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`CREATE INDEX \`episodes_episode_number_idx\` ON \`episodes\` (\`episode_number\`);`
  );
  await db.run(
    sql`CREATE INDEX \`episodes_published_at_idx\` ON \`episodes\` (\`published_at\`);`
  );
  await db.run(
    sql`CREATE INDEX \`episodes_status_idx\` ON \`episodes\` (\`status\`);`
  );
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`episodes_episode_number_idx\`;`);
  await db.run(sql`DROP INDEX \`episodes_published_at_idx\`;`);
  await db.run(sql`DROP INDEX \`episodes_status_idx\`;`);
}
