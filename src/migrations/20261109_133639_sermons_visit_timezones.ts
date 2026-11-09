import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_sermons_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__sermons_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_events_startdate_tz" AS ENUM('Africa/Lagos', 'Africa/Accra', 'Africa/Nairobi', 'Africa/Johannesburg', 'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'UTC');
  CREATE TYPE "public"."enum_events_enddate_tz" AS ENUM('Africa/Lagos', 'Africa/Accra', 'Africa/Nairobi', 'Africa/Johannesburg', 'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'UTC');
  CREATE TYPE "public"."enum__events_v_version_startdate_tz" AS ENUM('Africa/Lagos', 'Africa/Accra', 'Africa/Nairobi', 'Africa/Johannesburg', 'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'UTC');
  CREATE TYPE "public"."enum__events_v_version_enddate_tz" AS ENUM('Africa/Lagos', 'Africa/Accra', 'Africa/Nairobi', 'Africa/Johannesburg', 'Europe/London', 'Europe/Berlin', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'UTC');
  CREATE TABLE "sermons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"speaker" varchar,
  	"date" timestamp(3) with time zone,
  	"video_url" varchar,
  	"audio_url" varchar,
  	"series" varchar,
  	"scripture" varchar,
  	"thumbnail_id" integer,
  	"summary" varchar,
  	"notes" jsonb,
  	"slug" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_sermons_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_sermons_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_speaker" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_video_url" varchar,
  	"version_audio_url" varchar,
  	"version_series" varchar,
  	"version_scripture" varchar,
  	"version_thumbnail_id" integer,
  	"version_summary" varchar,
  	"version_notes" jsonb,
  	"version_slug" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__sermons_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "events" ADD COLUMN "startdate_tz" "enum_events_startdate_tz" DEFAULT 'Africa/Lagos';
  ALTER TABLE "events" ADD COLUMN "enddate_tz" "enum_events_enddate_tz" DEFAULT 'Africa/Lagos';
  ALTER TABLE "_events_v" ADD COLUMN "version_startdate_tz" "enum__events_v_version_startdate_tz" DEFAULT 'Africa/Lagos';
  ALTER TABLE "_events_v" ADD COLUMN "version_enddate_tz" "enum__events_v_version_enddate_tz" DEFAULT 'Africa/Lagos';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sermons_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "visit_eyebrow" varchar;
  ALTER TABLE "home_page" ADD COLUMN "visit_heading" varchar;
  ALTER TABLE "home_page" ADD COLUMN "visit_body" varchar;
  ALTER TABLE "home_page" ADD COLUMN "visit_image_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "visit_link_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "visit_link_url" varchar;
  ALTER TABLE "home_page" ADD COLUMN "visit_link_new_tab" boolean;
  ALTER TABLE "home_page" ADD COLUMN "sermons_section_eyebrow" varchar;
  ALTER TABLE "home_page" ADD COLUMN "sermons_section_heading" varchar;
  ALTER TABLE "home_page" ADD COLUMN "sermons_section_show" boolean DEFAULT true;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_visit_eyebrow" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_visit_heading" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_visit_body" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_visit_image_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_visit_link_label" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_visit_link_url" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_visit_link_new_tab" boolean;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_sermons_section_eyebrow" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_sermons_section_heading" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_sermons_section_show" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "livestream_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "video_channel_url" varchar;
  ALTER TABLE "sermons" ADD CONSTRAINT "sermons_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sermons" ADD CONSTRAINT "sermons_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sermons_v" ADD CONSTRAINT "_sermons_v_parent_id_sermons_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sermons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sermons_v" ADD CONSTRAINT "_sermons_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sermons_v" ADD CONSTRAINT "_sermons_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "sermons_thumbnail_idx" ON "sermons" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "sermons_slug_idx" ON "sermons" USING btree ("slug");
  CREATE INDEX "sermons_meta_meta_image_idx" ON "sermons" USING btree ("meta_image_id");
  CREATE INDEX "sermons_updated_at_idx" ON "sermons" USING btree ("updated_at");
  CREATE INDEX "sermons_created_at_idx" ON "sermons" USING btree ("created_at");
  CREATE INDEX "sermons__status_idx" ON "sermons" USING btree ("_status");
  CREATE INDEX "_sermons_v_parent_idx" ON "_sermons_v" USING btree ("parent_id");
  CREATE INDEX "_sermons_v_version_version_thumbnail_idx" ON "_sermons_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_sermons_v_version_version_slug_idx" ON "_sermons_v" USING btree ("version_slug");
  CREATE INDEX "_sermons_v_version_meta_version_meta_image_idx" ON "_sermons_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_sermons_v_version_version_updated_at_idx" ON "_sermons_v" USING btree ("version_updated_at");
  CREATE INDEX "_sermons_v_version_version_created_at_idx" ON "_sermons_v" USING btree ("version_created_at");
  CREATE INDEX "_sermons_v_version_version__status_idx" ON "_sermons_v" USING btree ("version__status");
  CREATE INDEX "_sermons_v_created_at_idx" ON "_sermons_v" USING btree ("created_at");
  CREATE INDEX "_sermons_v_updated_at_idx" ON "_sermons_v" USING btree ("updated_at");
  CREATE INDEX "_sermons_v_latest_idx" ON "_sermons_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sermons_fk" FOREIGN KEY ("sermons_id") REFERENCES "public"."sermons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_visit_image_id_media_id_fk" FOREIGN KEY ("visit_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_visit_image_id_media_id_fk" FOREIGN KEY ("version_visit_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_sermons_id_idx" ON "payload_locked_documents_rels" USING btree ("sermons_id");
  CREATE INDEX "home_page_visit_visit_image_idx" ON "home_page" USING btree ("visit_image_id");
  CREATE INDEX "_home_page_v_version_visit_version_visit_image_idx" ON "_home_page_v" USING btree ("version_visit_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "sermons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_sermons_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "sermons" CASCADE;
  DROP TABLE "_sermons_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sermons_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_visit_image_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_visit_image_id_media_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_sermons_id_idx";
  DROP INDEX "home_page_visit_visit_image_idx";
  DROP INDEX "_home_page_v_version_visit_version_visit_image_idx";
  ALTER TABLE "events" DROP COLUMN "startdate_tz";
  ALTER TABLE "events" DROP COLUMN "enddate_tz";
  ALTER TABLE "_events_v" DROP COLUMN "version_startdate_tz";
  ALTER TABLE "_events_v" DROP COLUMN "version_enddate_tz";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sermons_id";
  ALTER TABLE "home_page" DROP COLUMN "visit_eyebrow";
  ALTER TABLE "home_page" DROP COLUMN "visit_heading";
  ALTER TABLE "home_page" DROP COLUMN "visit_body";
  ALTER TABLE "home_page" DROP COLUMN "visit_image_id";
  ALTER TABLE "home_page" DROP COLUMN "visit_link_label";
  ALTER TABLE "home_page" DROP COLUMN "visit_link_url";
  ALTER TABLE "home_page" DROP COLUMN "visit_link_new_tab";
  ALTER TABLE "home_page" DROP COLUMN "sermons_section_eyebrow";
  ALTER TABLE "home_page" DROP COLUMN "sermons_section_heading";
  ALTER TABLE "home_page" DROP COLUMN "sermons_section_show";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_visit_eyebrow";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_visit_heading";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_visit_body";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_visit_image_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_visit_link_label";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_visit_link_url";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_visit_link_new_tab";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_sermons_section_eyebrow";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_sermons_section_heading";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_sermons_section_show";
  ALTER TABLE "site_settings" DROP COLUMN "livestream_url";
  ALTER TABLE "site_settings" DROP COLUMN "video_channel_url";
  DROP TYPE "public"."enum_sermons_status";
  DROP TYPE "public"."enum__sermons_v_version_status";
  DROP TYPE "public"."enum_events_startdate_tz";
  DROP TYPE "public"."enum_events_enddate_tz";
  DROP TYPE "public"."enum__events_v_version_startdate_tz";
  DROP TYPE "public"."enum__events_v_version_enddate_tz";`)
}
