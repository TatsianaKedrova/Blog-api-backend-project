import {
  PostDBType,
  PostInputModel,
  PostViewModel,
} from "../dto/postsDTO/PostModel";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import { ObjectId } from "mongodb";
import { postsCommandsRepository } from "../repositories/commands-repository/postsCommandsRepository";
import { blogsQueryRepository } from "../repositories/query-repository/blogsQueryRepository";

export const postsService = {
  async createNewPost(body: PostInputModel): Promise<PostViewModel> {
    const { title, shortDescription, content, blogId } = body;
    const blog = await blogsQueryRepository.findBlogById(blogId);
    const newPost: PostDBType = {
      title,
      shortDescription,
      content,
      blogId: new ObjectId(blogId),
      blogName: blog!.name,
      createdAt: creationDate(),
    };
    return await postsCommandsRepository.createNewPost(newPost);
  },
  async updatePostById(id: string, body: PostInputModel): Promise<boolean> {
    return await postsCommandsRepository.updatePostById(id, body);
  },
  async deletePostById(id: string): Promise<boolean> {
    return await postsCommandsRepository.deletePostById(id);
  },
};
