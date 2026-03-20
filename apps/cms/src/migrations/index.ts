import * as migration_20260320_120144_initial from "./20260320_120144_initial";

export const migrations = [
  {
    up: migration_20260320_120144_initial.up,
    down: migration_20260320_120144_initial.down,
    name: "20260320_120144_initial",
  },
];
