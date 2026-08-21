import {MigrateDownArgs, MigrateUpArgs, sql} from '@payloadcms/db-d1-sqlite';

export async function up({db}: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`posts_rels\` ADD \`credentials_id\` integer REFERENCES credentials(id);`,
  );
  await db.run(
    sql`CREATE INDEX \`posts_rels_credentials_id_idx\` ON \`posts_rels\` (\`credentials_id\`);`,
  );
  await db.run(
    sql`ALTER TABLE \`_posts_v_rels\` ADD \`credentials_id\` integer REFERENCES credentials(id);`,
  );
  await db.run(
    sql`CREATE INDEX \`_posts_v_rels_credentials_id_idx\` ON \`_posts_v_rels\` (\`credentials_id\`);`,
  );

  await db.run(sql`DROP TABLE \`_products_v_version_approvals_locales\`;`);
  await db.run(sql`DROP TABLE \`_products_v_version_approvals\`;`);
  await db.run(sql`DROP TABLE \`products_approvals_locales\`;`);
  await db.run(sql`DROP TABLE \`products_approvals\`;`);
  await db.run(sql`DROP TABLE \`_credentials_v_rels\`;`);
  await db.run(sql`DROP TABLE \`credentials_rels\`;`);

  await db.run(sql`ALTER TABLE \`posts\` DROP COLUMN \`cover_url\`;`);
  await db.run(
    sql`ALTER TABLE \`_posts_v\` DROP COLUMN \`version_cover_url\`;`,
  );
  await db.run(sql`ALTER TABLE \`products\` DROP COLUMN \`cover_url\`;`);
  await db.run(
    sql`ALTER TABLE \`_products_v\` DROP COLUMN \`version_cover_url\`;`,
  );
}

export async function down({db}: MigrateDownArgs): Promise<void> {
  await db.run(
    sql`ALTER TABLE \`_products_v\` ADD \`version_cover_url\` text;`,
  );
  await db.run(sql`ALTER TABLE \`products\` ADD \`cover_url\` text;`);
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_cover_url\` text;`);
  await db.run(sql`ALTER TABLE \`posts\` ADD \`cover_url\` text;`);

  await db.run(sql`CREATE TABLE \`credentials_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`products_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`credentials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(
    sql`CREATE INDEX \`credentials_rels_order_idx\` ON \`credentials_rels\` (\`order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`credentials_rels_parent_idx\` ON \`credentials_rels\` (\`parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`credentials_rels_path_idx\` ON \`credentials_rels\` (\`path\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`credentials_rels_products_id_idx\` ON \`credentials_rels\` (\`products_id\`);`,
  );

  await db.run(sql`CREATE TABLE \`_credentials_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`products_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_credentials_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(
    sql`CREATE INDEX \`_credentials_v_rels_order_idx\` ON \`_credentials_v_rels\` (\`order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_credentials_v_rels_parent_idx\` ON \`_credentials_v_rels\` (\`parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_credentials_v_rels_path_idx\` ON \`_credentials_v_rels\` (\`path\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_credentials_v_rels_products_id_idx\` ON \`_credentials_v_rels\` (\`products_id\`);`,
  );

  await db.run(sql`CREATE TABLE \`products_approvals\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`level\` text NOT NULL,
    \`certificate_no\` text,
    \`year\` text,
    \`document_id\` integer,
    FOREIGN KEY (\`document_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(
    sql`CREATE INDEX \`products_approvals_order_idx\` ON \`products_approvals\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`products_approvals_parent_id_idx\` ON \`products_approvals\` (\`_parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`products_approvals_document_idx\` ON \`products_approvals\` (\`document_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`products_approvals_locales\` (
    \`name\` text,
    \`region\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_approvals\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(
    sql`CREATE UNIQUE INDEX \`products_approvals_locales_locale_parent_id_unique\` ON \`products_approvals_locales\` (\`_locale\`,\`_parent_id\`);`,
  );

  await db.run(sql`CREATE TABLE \`_products_v_version_approvals\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`level\` text NOT NULL,
    \`certificate_no\` text,
    \`year\` text,
    \`document_id\` integer,
    \`_uuid\` text,
    FOREIGN KEY (\`document_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(
    sql`CREATE INDEX \`_products_v_version_approvals_order_idx\` ON \`_products_v_version_approvals\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_products_v_version_approvals_parent_id_idx\` ON \`_products_v_version_approvals\` (\`_parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_products_v_version_approvals_document_idx\` ON \`_products_v_version_approvals\` (\`document_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_products_v_version_approvals_locales\` (
    \`name\` text,
    \`region\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_version_approvals\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(
    sql`CREATE UNIQUE INDEX \`_products_v_version_approvals_locales_locale_parent_id_unique\` ON \`_products_v_version_approvals_locales\` (\`_locale\`,\`_parent_id\`);`,
  );

  await db.run(sql`DROP INDEX \`_posts_v_rels_credentials_id_idx\`;`);
  await db.run(
    sql`ALTER TABLE \`_posts_v_rels\` DROP COLUMN \`credentials_id\`;`,
  );
  await db.run(sql`DROP INDEX \`posts_rels_credentials_id_idx\`;`);
  await db.run(sql`ALTER TABLE \`posts_rels\` DROP COLUMN \`credentials_id\`;`);
}
