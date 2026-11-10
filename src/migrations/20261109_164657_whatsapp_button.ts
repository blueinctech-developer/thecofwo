import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "whatsapp_number" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "whatsapp_enabled" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "whatsapp_message" varchar DEFAULT 'Hello COFWO, I would like to know more.';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "whatsapp_number";
  ALTER TABLE "site_settings" DROP COLUMN "whatsapp_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "whatsapp_message";`)
}
