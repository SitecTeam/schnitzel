import * as migration_20260320_120144_initial from "./20260320_120144_initial";
import * as migration_20260320_131853_add_music_array from "./20260320_131853_add_music_array";
import * as migration_20260323_121900_add_media_focal_point from "./20260323_121900_add_media_focal_point";

export const migrations = [
  {
    up: migration_20260320_120144_initial.up,
    down: migration_20260320_120144_initial.down,
    name: "20260320_120144_initial",
  },
  {
    up: migration_20260320_131853_add_music_array.up,
    down: migration_20260320_131853_add_music_array.down,
    name: "20260320_131853_add_music_array",
  },
  {
    up: migration_20260323_121900_add_media_focal_point.up,
    down: migration_20260323_121900_add_media_focal_point.down,
    name: "20260323_121900_add_media_focal_point",
  },
];
