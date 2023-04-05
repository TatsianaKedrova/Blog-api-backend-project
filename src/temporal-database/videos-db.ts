import { TVideo } from "../dto/videosDTO/CreateVideoModel";

export type TDataBase = {
  [key: string]: TVideo[];
};
export let db: TDataBase = {
  videos: [],
};
