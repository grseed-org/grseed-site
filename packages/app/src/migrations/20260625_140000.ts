import {MigrateDownArgs, MigrateUpArgs, sql} from '@payloadcms/db-d1-sqlite';

export async function up({db}: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`media\` ADD \`asset_key\` text;`);
  await db.run(sql`ALTER TABLE \`media\` ADD \`source_path\` text;`);
  await db.run(sql`ALTER TABLE \`media\` ADD \`source_url\` text;`);
  await db.run(sql`CREATE UNIQUE INDEX \`media_asset_key_idx\` ON \`media\` (\`asset_key\`);`);

  await db.run(sql`ALTER TABLE \`tags\` ADD \`kind\` text DEFAULT 'trait' NOT NULL;`);

  await db.run(sql`CREATE TABLE \`credentials\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`slug\` text NOT NULL,
    \`type\` text NOT NULL,
    \`level\` text,
    \`certificate_no\` text,
    \`year\` text,
    \`date\` text,
    \`display_order\` numeric,
    \`published_at\` text,
    \`seo_image_id\` integer,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`_status\` text DEFAULT 'draft',
    FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );`);
  await db.run(sql`CREATE UNIQUE INDEX \`credentials_slug_idx\` ON \`credentials\` (\`slug\`);`);
  await db.run(sql`CREATE INDEX \`credentials_seo_seo_image_idx\` ON \`credentials\` (\`seo_image_id\`);`);
  await db.run(sql`CREATE INDEX \`credentials_updated_at_idx\` ON \`credentials\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX \`credentials_created_at_idx\` ON \`credentials\` (\`created_at\`);`);
  await db.run(sql`CREATE INDEX \`credentials__status_idx\` ON \`credentials\` (\`_status\`);`);
  await db.run(sql`CREATE TABLE \`credentials_locales\` (
    \`title\` text NOT NULL,
    \`summary\` text,
    \`issuer\` text,
    \`seo_title\` text,
    \`seo_description\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`credentials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE UNIQUE INDEX \`credentials_locales_locale_parent_id_unique\` ON \`credentials_locales\` (\`_locale\`,\`_parent_id\`);`);
  await db.run(sql`CREATE TABLE \`credentials_document_images\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`image_id\` integer NOT NULL,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`credentials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE INDEX \`credentials_document_images_order_idx\` ON \`credentials_document_images\` (\`_order\`);`);
  await db.run(sql`CREATE INDEX \`credentials_document_images_parent_id_idx\` ON \`credentials_document_images\` (\`_parent_id\`);`);
  await db.run(sql`CREATE INDEX \`credentials_document_images_image_idx\` ON \`credentials_document_images\` (\`image_id\`);`);
  await db.run(sql`CREATE TABLE \`credentials_document_images_locales\` (
    \`caption\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`credentials_document_images\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE UNIQUE INDEX \`credentials_document_images_locales_locale_parent_id_unique\` ON \`credentials_document_images_locales\` (\`_locale\`,\`_parent_id\`);`);
  await db.run(sql`CREATE TABLE \`credentials_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`products_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`credentials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE INDEX \`credentials_rels_order_idx\` ON \`credentials_rels\` (\`order\`);`);
  await db.run(sql`CREATE INDEX \`credentials_rels_parent_idx\` ON \`credentials_rels\` (\`parent_id\`);`);
  await db.run(sql`CREATE INDEX \`credentials_rels_path_idx\` ON \`credentials_rels\` (\`path\`);`);
  await db.run(sql`CREATE INDEX \`credentials_rels_products_id_idx\` ON \`credentials_rels\` (\`products_id\`);`);

  await db.run(sql`CREATE TABLE \`_credentials_v\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`parent_id\` integer,
    \`version_slug\` text,
    \`version_type\` text,
    \`version_level\` text,
    \`version_certificate_no\` text,
    \`version_year\` text,
    \`version_date\` text,
    \`version_display_order\` numeric,
    \`version_published_at\` text,
    \`version_seo_image_id\` integer,
    \`version_updated_at\` text,
    \`version_created_at\` text,
    \`version__status\` text DEFAULT 'draft',
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`snapshot\` integer,
    \`published_locale\` text,
    \`latest\` integer,
    \`autosave\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`credentials\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );`);
  await db.run(sql`CREATE INDEX \`_credentials_v_parent_idx\` ON \`_credentials_v\` (\`parent_id\`);`);
  await db.run(sql`CREATE INDEX \`_credentials_v_created_at_idx\` ON \`_credentials_v\` (\`created_at\`);`);
  await db.run(sql`CREATE INDEX \`_credentials_v_updated_at_idx\` ON \`_credentials_v\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX \`_credentials_v_snapshot_idx\` ON \`_credentials_v\` (\`snapshot\`);`);
  await db.run(sql`CREATE INDEX \`_credentials_v_latest_idx\` ON \`_credentials_v\` (\`latest\`);`);
  await db.run(sql`CREATE TABLE \`_credentials_v_locales\` (
    \`version_title\` text,
    \`version_summary\` text,
    \`version_issuer\` text,
    \`version_seo_title\` text,
    \`version_seo_description\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_credentials_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE UNIQUE INDEX \`_credentials_v_locales_locale_parent_id_unique\` ON \`_credentials_v_locales\` (\`_locale\`,\`_parent_id\`);`);
  await db.run(sql`CREATE TABLE \`_credentials_v_version_document_images\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`image_id\` integer NOT NULL,
    \`_uuid\` text,
    FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_credentials_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE INDEX \`_credentials_v_version_document_images_order_idx\` ON \`_credentials_v_version_document_images\` (\`_order\`);`);
  await db.run(sql`CREATE INDEX \`_credentials_v_version_document_images_parent_id_idx\` ON \`_credentials_v_version_document_images\` (\`_parent_id\`);`);
  await db.run(sql`CREATE INDEX \`_credentials_v_version_document_images_image_idx\` ON \`_credentials_v_version_document_images\` (\`image_id\`);`);
  await db.run(sql`CREATE TABLE \`_credentials_v_version_document_images_locales\` (
    \`caption\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_credentials_v_version_document_images\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE UNIQUE INDEX \`_credentials_v_version_document_images_locales_locale_parent_id_unique\` ON \`_credentials_v_version_document_images_locales\` (\`_locale\`,\`_parent_id\`);`);
  await db.run(sql`CREATE TABLE \`_credentials_v_rels\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    \`products_id\` integer,
    FOREIGN KEY (\`parent_id\`) REFERENCES \`_credentials_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE INDEX \`_credentials_v_rels_order_idx\` ON \`_credentials_v_rels\` (\`order\`);`);
  await db.run(sql`CREATE INDEX \`_credentials_v_rels_parent_idx\` ON \`_credentials_v_rels\` (\`parent_id\`);`);
  await db.run(sql`CREATE INDEX \`_credentials_v_rels_path_idx\` ON \`_credentials_v_rels\` (\`path\`);`);
  await db.run(sql`CREATE INDEX \`_credentials_v_rels_products_id_idx\` ON \`_credentials_v_rels\` (\`products_id\`);`);

  await db.run(sql`CREATE TABLE \`products_facts\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`group\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE INDEX \`products_facts_order_idx\` ON \`products_facts\` (\`_order\`);`);
  await db.run(sql`CREATE INDEX \`products_facts_parent_id_idx\` ON \`products_facts\` (\`_parent_id\`);`);
  await db.run(sql`CREATE TABLE \`products_facts_locales\` (
    \`label\` text NOT NULL,
    \`value\` text NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_facts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE UNIQUE INDEX \`products_facts_locales_locale_parent_id_unique\` ON \`products_facts_locales\` (\`_locale\`,\`_parent_id\`);`);
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
  await db.run(sql`CREATE INDEX \`products_approvals_order_idx\` ON \`products_approvals\` (\`_order\`);`);
  await db.run(sql`CREATE INDEX \`products_approvals_parent_id_idx\` ON \`products_approvals\` (\`_parent_id\`);`);
  await db.run(sql`CREATE INDEX \`products_approvals_document_idx\` ON \`products_approvals\` (\`document_id\`);`);
  await db.run(sql`CREATE TABLE \`products_approvals_locales\` (
    \`name\` text,
    \`region\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` text NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`products_approvals\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE UNIQUE INDEX \`products_approvals_locales_locale_parent_id_unique\` ON \`products_approvals_locales\` (\`_locale\`,\`_parent_id\`);`);
  await db.run(sql`ALTER TABLE \`products_rels\` ADD \`credentials_id\` integer REFERENCES credentials(id);`);
  await db.run(sql`CREATE INDEX \`products_rels_credentials_id_idx\` ON \`products_rels\` (\`credentials_id\`);`);

  await db.run(sql`CREATE TABLE \`_products_v_version_facts\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`group\` text NOT NULL,
    \`_uuid\` text,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE INDEX \`_products_v_version_facts_order_idx\` ON \`_products_v_version_facts\` (\`_order\`);`);
  await db.run(sql`CREATE INDEX \`_products_v_version_facts_parent_id_idx\` ON \`_products_v_version_facts\` (\`_parent_id\`);`);
  await db.run(sql`CREATE TABLE \`_products_v_version_facts_locales\` (
    \`label\` text,
    \`value\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_version_facts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE UNIQUE INDEX \`_products_v_version_facts_locales_locale_parent_id_unique\` ON \`_products_v_version_facts_locales\` (\`_locale\`,\`_parent_id\`);`);
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
  await db.run(sql`CREATE INDEX \`_products_v_version_approvals_order_idx\` ON \`_products_v_version_approvals\` (\`_order\`);`);
  await db.run(sql`CREATE INDEX \`_products_v_version_approvals_parent_id_idx\` ON \`_products_v_version_approvals\` (\`_parent_id\`);`);
  await db.run(sql`CREATE INDEX \`_products_v_version_approvals_document_idx\` ON \`_products_v_version_approvals\` (\`document_id\`);`);
  await db.run(sql`CREATE TABLE \`_products_v_version_approvals_locales\` (
    \`name\` text,
    \`region\` text,
    \`id\` integer PRIMARY KEY NOT NULL,
    \`_locale\` text NOT NULL,
    \`_parent_id\` integer NOT NULL,
    FOREIGN KEY (\`_parent_id\`) REFERENCES \`_products_v_version_approvals\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );`);
  await db.run(sql`CREATE UNIQUE INDEX \`_products_v_version_approvals_locales_locale_parent_id_unique\` ON \`_products_v_version_approvals_locales\` (\`_locale\`,\`_parent_id\`);`);
  await db.run(sql`ALTER TABLE \`_products_v_rels\` ADD \`credentials_id\` integer REFERENCES credentials(id);`);
  await db.run(sql`CREATE INDEX \`_products_v_rels_credentials_id_idx\` ON \`_products_v_rels\` (\`credentials_id\`);`);
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`credentials_id\` integer REFERENCES credentials(id);`);
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_credentials_id_idx\` ON \`payload_locked_documents_rels\` (\`credentials_id\`);`);
}

export async function down({db}: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_products_v_version_approvals_locales\`;`);
  await db.run(sql`DROP TABLE \`_products_v_version_approvals\`;`);
  await db.run(sql`DROP TABLE \`_products_v_version_facts_locales\`;`);
  await db.run(sql`DROP TABLE \`_products_v_version_facts\`;`);
  await db.run(sql`DROP TABLE \`products_approvals_locales\`;`);
  await db.run(sql`DROP TABLE \`products_approvals\`;`);
  await db.run(sql`DROP TABLE \`products_facts_locales\`;`);
  await db.run(sql`DROP TABLE \`products_facts\`;`);
  await db.run(sql`DROP TABLE \`_credentials_v_rels\`;`);
  await db.run(sql`DROP TABLE \`_credentials_v_version_document_images_locales\`;`);
  await db.run(sql`DROP TABLE \`_credentials_v_version_document_images\`;`);
  await db.run(sql`DROP TABLE \`_credentials_v_locales\`;`);
  await db.run(sql`DROP TABLE \`_credentials_v\`;`);
  await db.run(sql`DROP TABLE \`credentials_rels\`;`);
  await db.run(sql`DROP TABLE \`credentials_document_images_locales\`;`);
  await db.run(sql`DROP TABLE \`credentials_document_images\`;`);
  await db.run(sql`DROP TABLE \`credentials_locales\`;`);
  await db.run(sql`DROP TABLE \`credentials\`;`);
}
