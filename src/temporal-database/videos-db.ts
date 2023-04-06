import { BlogViewModel } from "../dto/blogsDTO/BlogViewModel";
import { PostViewModel } from "../dto/postsDTO/PostViewModel";
import { TVideo } from "../dto/videosDTO/CreateVideoModel";

export type TDataBase = {
  videos: TVideo[];
  blogs: BlogViewModel[];
  posts: PostViewModel[]
};
export let db: TDataBase = {
  videos: [],
  blogs: [],
  posts: [],
};
