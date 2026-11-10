import * as migration_20261109_121823_initial from './20261109_121823_initial';
import * as migration_20261109_133639_sermons_visit_timezones from './20261109_133639_sermons_visit_timezones';
import * as migration_20261109_154044_home_connect_card from './20261109_154044_home_connect_card';
import * as migration_20261109_164657_whatsapp_button from './20261109_164657_whatsapp_button';
import * as migration_20261110_082327_hero_slides from './20261110_082327_hero_slides';
import * as migration_20261110_132622_media_storage_fields from './20261110_132622_media_storage_fields';

export const migrations = [
  {
    up: migration_20261109_121823_initial.up,
    down: migration_20261109_121823_initial.down,
    name: '20261109_121823_initial',
  },
  {
    up: migration_20261109_133639_sermons_visit_timezones.up,
    down: migration_20261109_133639_sermons_visit_timezones.down,
    name: '20261109_133639_sermons_visit_timezones',
  },
  {
    up: migration_20261109_154044_home_connect_card.up,
    down: migration_20261109_154044_home_connect_card.down,
    name: '20261109_154044_home_connect_card',
  },
  {
    up: migration_20261109_164657_whatsapp_button.up,
    down: migration_20261109_164657_whatsapp_button.down,
    name: '20261109_164657_whatsapp_button',
  },
  {
    up: migration_20261110_082327_hero_slides.up,
    down: migration_20261110_082327_hero_slides.down,
    name: '20261110_082327_hero_slides',
  },
  {
    up: migration_20261110_132622_media_storage_fields.up,
    down: migration_20261110_132622_media_storage_fields.down,
    name: '20261110_132622_media_storage_fields'
  },
];
