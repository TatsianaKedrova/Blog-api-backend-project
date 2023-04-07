import { BlogViewModel } from "../dto/blogsDTO/BlogViewModel";
import { PostViewModel } from "../dto/postsDTO/PostViewModel";
import { TVideo } from "../dto/videosDTO/CreateVideoModel";

export type TDataBase = {
  videos: TVideo[];
  blogs: BlogViewModel[];
  posts: PostViewModel[];
};
export let db: TDataBase = {
  videos: [],
  blogs: [
    {
      id: "123",
      name: "Tania",
      description: "Tania loves backend",
      websiteUrl: "string.com",
    },
    {
      id: "456",
      name: "Prince",
      description: "Prince loves to read",
      websiteUrl: "prince.com",
    },
    {
      id: "789",
      name: "Dear Baby",
      description: "Dear Baby loves to play",
      websiteUrl: "dear-baby.com",
    },
  ],
  posts: [
    {
      id: "string",
      title: "Late night",
      shortDescription: "I am sitting and learning great node js",
      content: "Content - this is content! Love you so much",
      blogId: "123",
      blogName: "Tania",
    },
  ],
};
