import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`blog_index\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_image_id\` integer,
  	\`seo_image_id\` integer,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`blog_index_hero_image_idx\` ON \`blog_index\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_index_seo_seo_image_idx\` ON \`blog_index\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_index__status_idx\` ON \`blog_index\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`blog_index_locales\` (
  	\`title\` text,
  	\`summary\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blog_index\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`blog_index_locales_locale_parent_id_unique\` ON \`blog_index_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_blog_index_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_image_id\` integer,
  	\`version_seo_image_id\` integer,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_blog_index_v_version_version_hero_image_idx\` ON \`_blog_index_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_blog_index_v_version_seo_version_seo_image_idx\` ON \`_blog_index_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_blog_index_v_version_version__status_idx\` ON \`_blog_index_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_blog_index_v_created_at_idx\` ON \`_blog_index_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_blog_index_v_updated_at_idx\` ON \`_blog_index_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_blog_index_v_snapshot_idx\` ON \`_blog_index_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_blog_index_v_published_locale_idx\` ON \`_blog_index_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_blog_index_v_latest_idx\` ON \`_blog_index_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_blog_index_v_locales\` (
  	\`version_title\` text,
  	\`version_summary\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_blog_index_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_blog_index_v_locales_locale_parent_id_unique\` ON \`_blog_index_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`product_index\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_image_id\` integer,
  	\`seo_image_id\` integer,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`product_index_hero_image_idx\` ON \`product_index\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`product_index_seo_seo_image_idx\` ON \`product_index\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`product_index__status_idx\` ON \`product_index\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`product_index_locales\` (
  	\`title\` text,
  	\`summary\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`product_index\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`product_index_locales_locale_parent_id_unique\` ON \`product_index_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_product_index_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_image_id\` integer,
  	\`version_seo_image_id\` integer,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_product_index_v_version_version_hero_image_idx\` ON \`_product_index_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_product_index_v_version_seo_version_seo_image_idx\` ON \`_product_index_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_product_index_v_version_version__status_idx\` ON \`_product_index_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_product_index_v_created_at_idx\` ON \`_product_index_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_product_index_v_updated_at_idx\` ON \`_product_index_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_product_index_v_snapshot_idx\` ON \`_product_index_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_product_index_v_published_locale_idx\` ON \`_product_index_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_product_index_v_latest_idx\` ON \`_product_index_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_product_index_v_locales\` (
  	\`version_title\` text,
  	\`version_summary\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_product_index_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_product_index_v_locales_locale_parent_id_unique\` ON \`_product_index_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`contact_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_sections_order_idx\` ON \`contact_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_sections_parent_id_idx\` ON \`contact_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`contact_sections_image_idx\` ON \`contact_sections\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`contact_sections_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`contact_sections_locales_locale_parent_id_unique\` ON \`contact_sections_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_contact_v_version_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_v_version_sections_order_idx\` ON \`_contact_v_version_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_contact_v_version_sections_parent_id_idx\` ON \`_contact_v_version_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_contact_v_version_sections_image_idx\` ON \`_contact_v_version_sections\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_contact_v_version_sections_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_v_version_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_contact_v_version_sections_locales_locale_parent_id_unique\` ON \`_contact_v_version_sections_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_sections_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_footer_sections_items_order_idx\` ON \`navigation_footer_sections_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_footer_sections_items_parent_id_idx\` ON \`navigation_footer_sections_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_sections_items_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer_sections_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_footer_sections_items_locales_locale_parent_id_un\` ON \`navigation_footer_sections_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`key\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_footer_sections_order_idx\` ON \`navigation_footer_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_footer_sections_parent_id_idx\` ON \`navigation_footer_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_sections_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_footer_sections_locales_locale_parent_id_unique\` ON \`navigation_footer_sections_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_sections_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_footer_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_sections_items_order_idx\` ON \`_navigation_v_version_footer_sections_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_sections_items_parent_id_idx\` ON \`_navigation_v_version_footer_sections_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_sections_items_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_footer_sections_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_navigation_v_version_footer_sections_items_locales_locale_p\` ON \`_navigation_v_version_footer_sections_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_sections_order_idx\` ON \`_navigation_v_version_footer_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_sections_parent_id_idx\` ON \`_navigation_v_version_footer_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_sections_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_footer_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_navigation_v_version_footer_sections_locales_locale_parent_\` ON \`_navigation_v_version_footer_sections_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`DROP TABLE \`navigation_footer\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_locales\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_locales\`;`)
  await db.run(sql`ALTER TABLE \`home_sections_locales\` ADD \`eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`_home_v_version_sections_locales\` ADD \`eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`about_sections_locales\` ADD \`eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`_about_v_version_sections_locales\` ADD \`eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`research_sections_locales\` ADD \`eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`_research_v_version_sections_locales\` ADD \`eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`service_sections_locales\` ADD \`eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`_service_v_version_sections_locales\` ADD \`eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`hr_sections_locales\` ADD \`eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`_hr_v_version_sections_locales\` ADD \`eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`site_name_en\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`site_name_en_short\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings_locales\` ADD \`copyright\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings_locales\` ADD \`icp\` text;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` ADD \`version_site_name_en\` text;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` ADD \`version_site_name_en_short\` text;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v_locales\` ADD \`version_copyright\` text;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v_locales\` ADD \`version_icp\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`navigation_footer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`navigation_footer_order_idx\` ON \`navigation_footer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_footer_parent_id_idx\` ON \`navigation_footer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`navigation_footer_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation_footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`navigation_footer_locales_locale_parent_id_unique\` ON \`navigation_footer_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_order_idx\` ON \`_navigation_v_version_footer\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_footer_parent_id_idx\` ON \`_navigation_v_version_footer\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_footer_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v_version_footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_navigation_v_version_footer_locales_locale_parent_id_unique\` ON \`_navigation_v_version_footer_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`DROP TABLE \`blog_index\`;`)
  await db.run(sql`DROP TABLE \`blog_index_locales\`;`)
  await db.run(sql`DROP TABLE \`_blog_index_v\`;`)
  await db.run(sql`DROP TABLE \`_blog_index_v_locales\`;`)
  await db.run(sql`DROP TABLE \`product_index\`;`)
  await db.run(sql`DROP TABLE \`product_index_locales\`;`)
  await db.run(sql`DROP TABLE \`_product_index_v\`;`)
  await db.run(sql`DROP TABLE \`_product_index_v_locales\`;`)
  await db.run(sql`DROP TABLE \`contact_sections\`;`)
  await db.run(sql`DROP TABLE \`contact_sections_locales\`;`)
  await db.run(sql`DROP TABLE \`_contact_v_version_sections\`;`)
  await db.run(sql`DROP TABLE \`_contact_v_version_sections_locales\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_sections_items\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_sections_items_locales\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_sections\`;`)
  await db.run(sql`DROP TABLE \`navigation_footer_sections_locales\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_sections_items\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_sections_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_sections\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_footer_sections_locales\`;`)
  await db.run(sql`ALTER TABLE \`home_sections_locales\` DROP COLUMN \`eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`_home_v_version_sections_locales\` DROP COLUMN \`eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`about_sections_locales\` DROP COLUMN \`eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`_about_v_version_sections_locales\` DROP COLUMN \`eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`research_sections_locales\` DROP COLUMN \`eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`_research_v_version_sections_locales\` DROP COLUMN \`eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`service_sections_locales\` DROP COLUMN \`eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`_service_v_version_sections_locales\` DROP COLUMN \`eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`hr_sections_locales\` DROP COLUMN \`eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`_hr_v_version_sections_locales\` DROP COLUMN \`eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`site_name_en\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`site_name_en_short\`;`)
  await db.run(sql`ALTER TABLE \`site_settings_locales\` DROP COLUMN \`copyright\`;`)
  await db.run(sql`ALTER TABLE \`site_settings_locales\` DROP COLUMN \`icp\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` DROP COLUMN \`version_site_name_en\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v\` DROP COLUMN \`version_site_name_en_short\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v_locales\` DROP COLUMN \`version_copyright\`;`)
  await db.run(sql`ALTER TABLE \`_site_settings_v_locales\` DROP COLUMN \`version_icp\`;`)
}
