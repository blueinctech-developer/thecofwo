import * as migration_20261109_121823_initial from './20261109_121823_initial';
import * as migration_20261109_133639_sermons_visit_timezones from './20261109_133639_sermons_visit_timezones';

export const migrations = [
  {
    up: migration_20261109_121823_initial.up,
    down: migration_20261109_121823_initial.down,
    name: '20261109_121823_initial',
  },
  {
    up: migration_20261109_133639_sermons_visit_timezones.up,
    down: migration_20261109_133639_sermons_visit_timezones.down,
    name: '20261109_133639_sermons_visit_timezones'
  },
];
