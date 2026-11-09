import * as migration_20261109_121823_initial from './20261109_121823_initial';
import * as migration_20261109_133639_sermons_visit_timezones from './20261109_133639_sermons_visit_timezones';
import * as migration_20261109_154044_home_connect_card from './20261109_154044_home_connect_card';

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
    name: '20261109_154044_home_connect_card'
  },
];
