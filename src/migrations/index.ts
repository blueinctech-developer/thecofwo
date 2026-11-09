import * as migration_20261109_121823_initial from './20261109_121823_initial';

export const migrations = [
  {
    up: migration_20261109_121823_initial.up,
    down: migration_20261109_121823_initial.down,
    name: '20261109_121823_initial'
  },
];
