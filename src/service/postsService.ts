import {
  CreatePostForSpecificBlogType,
  PostDBType,
  PostInputModel,
  PostViewModel,
} from "../dto/postsDTO/PostModel";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import { ObjectId } from "mongodb";
import { postsCommandsRepository } from "../repositories/commands-repository/postsCommandsRepository";
import { blogsQueryRepository } from "../repositories/query-repository/blogsQueryRepository";
import { transformPostsResponse } from "../utils/posts-utils/transformPostsResponse";

class PostsService {
  async createNewPost(
    blogId: string,
    postData: Omit<PostInputModel, "blogId"> | PostInputModel,
  ): Promise<PostViewModel | null> {
    const { title, shortDescription, content } = postData;
    const blog = await blogsQueryRepository.findBlogById(blogId);
    if (!blog) {
      return null;
    }
    const newPost = new PostDBType({
      title,
      shortDescription,
      content,
      blogId: new ObjectId(blogId),
      blogName: blog.name,
      createdAt: creationDate(),
    });
    const newPostId = await postsCommandsRepository.createNewPost(newPost);
    const postTransformedResult = transformPostsResponse({
      ...newPost,
      _id: newPostId,
    });
    return postTransformedResult;
  }
  async updatePostById(id: string, body: PostInputModel): Promise<boolean> {
    return await postsCommandsRepository.updatePostById(id, body);
  }
  async deletePostById(id: string): Promise<boolean> {
    return await postsCommandsRepository.deletePostById(id);
  }
}

export const postsService = new PostsService();
