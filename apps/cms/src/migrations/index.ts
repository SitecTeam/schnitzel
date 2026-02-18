import * as migration_20260218_105914_initial from "./20260218_105914_initial";

export const migrations = [
  {
    up: migration_20260218_105914_initial.up,
    down: migration_20260218_105914_initial.down,
    name: "20260218_105914_initial",
  },
];
