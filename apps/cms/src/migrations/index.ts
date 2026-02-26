import * as migration_20260218_105914_initial from "./20260218_105914_initial";
import * as migration_20260225_141645_add_episodes from "./20260225_141645_add_episodes";

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
];
