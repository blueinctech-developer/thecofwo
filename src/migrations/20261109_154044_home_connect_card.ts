import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page" ADD COLUMN "connect_eyebrow" varchar;
  ALTER TABLE "home_page" ADD COLUMN "connect_heading" varchar;
  ALTER TABLE "home_page" ADD COLUMN "connect_body" varchar;
  ALTER TABLE "home_page" ADD COLUMN "connect_image_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "connect_link_label" varchar;
  ALTER TABLE "home_page" ADD COLUMN "connect_link_url" varchar;
  ALTER TABLE "home_page" ADD COLUMN "connect_link_new_tab" boolean;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_connect_eyebrow" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_connect_heading" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_connect_body" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_connect_image_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_connect_link_label" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_connect_link_url" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_connect_link_new_tab" boolean;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_connect_image_id_media_id_fk" FOREIGN KEY ("connect_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_connect_image_id_media_id_fk" FOREIGN KEY ("version_connect_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_connect_connect_image_idx" ON "home_page" USING btree ("connect_image_id");
  CREATE INDEX "_home_page_v_version_connect_version_connect_image_idx" ON "_home_page_v" USING btree ("version_connect_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page" DROP CONSTRAINT "home_page_connect_image_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_connect_image_id_media_id_fk";
  
  DROP INDEX "home_page_connect_connect_image_idx";
  DROP INDEX "_home_page_v_version_connect_version_connect_image_idx";
  ALTER TABLE "home_page" DROP COLUMN "connect_eyebrow";
  ALTER TABLE "home_page" DROP COLUMN "connect_heading";
  ALTER TABLE "home_page" DROP COLUMN "connect_body";
  ALTER TABLE "home_page" DROP COLUMN "connect_image_id";
  ALTER TABLE "home_page" DROP COLUMN "connect_link_label";
  ALTER TABLE "home_page" DROP COLUMN "connect_link_url";
  ALTER TABLE "home_page" DROP COLUMN "connect_link_new_tab";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_connect_eyebrow";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_connect_heading";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_connect_body";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_connect_image_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_connect_link_label";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_connect_link_url";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_connect_link_new_tab";`)
}
