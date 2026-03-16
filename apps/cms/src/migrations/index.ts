import * as migration_20260218_105914_initial from "./20260218_105914_initial";
import * as migration_20260225_141645_add_episodes from "./20260225_141645_add_episodes";
import * as migration_20260303_122020_add_episode_indexes from "./20260303_122020_add_episode_indexes";
import * as migration_20260316_150000_sync_episodes_schema from "./20260316_150000_sync_episodes_schema";

export const migrations = [
  {
    up: migration_20260218_105914_initial.up,
    down: migration_20260218_105914_initial.down,
    name: "20260218_105914_initial",
  },
  {
    up: migration_20260225_141645_add_episodes.up,
    down: migration_20260225_141645_add_episodes.down,
    name: "20260225_141645_add_episodes",
  },
  {
    up: migration_20260303_122020_add_episode_indexes.up,
    down: migration_20260303_122020_add_episode_indexes.down,
    name: "20260303_122020_add_episode_indexes",
  },
  {
    up: migration_20260316_150000_sync_episodes_schema.up,
    down: migration_20260316_150000_sync_episodes_schema.down,
    name: "20260316_150000_sync_episodes_schema",
  },
];
