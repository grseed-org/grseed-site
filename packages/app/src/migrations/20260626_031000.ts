import {MigrateDownArgs, MigrateUpArgs, sql} from '@payloadcms/db-d1-sqlite';

export async function up({db}: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`posts\` ADD \`cover_credential_id\` integer REFERENCES credentials(id);`,
  );
  await db.run(
    sql`CREATE INDEX \`posts_cover_credential_idx\` ON \`posts\` (\`cover_credential_id\`);`,
  );
  await db.run(
    sql`ALTER TABLE \`_posts_v\` ADD \`version_cover_credential_id\` integer REFERENCES credentials(id);`,
  );
  await db.run(
    sql`CREATE INDEX \`_posts_v_version_version_cover_credential_idx\` ON \`_posts_v\` (\`version_cover_credential_id\`);`,
  );
}

export async function down({db}: MigrateDownArgs): Promise<void> {
  await db.run(
    sql`DROP INDEX \`_posts_v_version_version_cover_credential_idx\`;`,
  );
  await db.run(
    sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`version_cover_credential_id\`;`,
  );
  await db.run(sql`DROP INDEX \`posts_cover_credential_idx\`;`);
  await db.run(sql`ALTER TABLE \`posts\` DROP COLUMN \`cover_credential_id\`;`);
}
