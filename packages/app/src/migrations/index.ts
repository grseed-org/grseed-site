import * as migration_20260625_063644 from './20260625_063644';
import * as migration_20260625_075601 from './20260625_075601';
import * as migration_20260625_102511 from './20260625_102511';
import * as migration_20260625_110223 from './20260625_110223';
import * as migration_20260625_140000 from './20260625_140000';
import * as migration_20260626_001500 from './20260626_001500';
import * as migration_20260626_031000 from './20260626_031000';

export const migrations = [
  {
    up: migration_20260625_063644.up,
    down: migration_20260625_063644.down,
    name: '20260625_063644',
  },
  {
    up: migration_20260625_075601.up,
    down: migration_20260625_075601.down,
    name: '20260625_075601',
  },
  {
    up: migration_20260625_102511.up,
    down: migration_20260625_102511.down,
    name: '20260625_102511',
  },
  {
    up: migration_20260625_110223.up,
    down: migration_20260625_110223.down,
    name: '20260625_110223',
  },
  {
    up: migration_20260625_140000.up,
    down: migration_20260625_140000.down,
    name: '20260625_140000',
  },
  {
    up: migration_20260626_001500.up,
    down: migration_20260626_001500.down,
    name: '20260626_001500',
  },
  {
    up: migration_20260626_031000.up,
    down: migration_20260626_031000.down,
    name: '20260626_031000',
  },
];
