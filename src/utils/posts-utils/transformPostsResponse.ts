import { PostDBType, PostViewModel } from "../../dto/postsDTO/PostModel";

export const transformPostsResponse = (post: PostDBType): PostViewModel => {
  return {
    id: post._id!.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    createdAt: post.createdAt,
    blogId: post.blogId.toString(),
    blogName: post.blogName,
  };
};
