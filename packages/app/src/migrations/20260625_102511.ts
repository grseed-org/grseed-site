import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`products_locales\` DROP COLUMN \`classification\`;`)
  await db.run(sql`ALTER TABLE \`_products_v_locales\` DROP COLUMN \`version_classification\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`products_locales\` ADD \`classification\` text;`)
  await db.run(sql`ALTER TABLE \`_products_v_locales\` ADD \`version_classification\` text;`)
}
