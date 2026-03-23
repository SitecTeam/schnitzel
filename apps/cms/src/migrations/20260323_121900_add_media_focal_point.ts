import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-d1-sqlite";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \
    \`media\` ADD \`focal_x\` numeric;`);
  await db.run(sql`ALTER TABLE \
    \`media\` ADD \`focal_y\` numeric;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`focal_x\`;`);
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`focal_y\`;`);
}
