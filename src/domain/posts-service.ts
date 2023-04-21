import {
  PostDBType,
  PostInputModel,
  PostViewModel,
} from "../dto/postsDTO/PostModel";
import { blogsService } from "./blogs-service";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import { ObjectId } from "mongodb";
import { postsCommandsRepository } from "../repositories/commands-repository/postsCommandsRepository";
import { postsQueryRepository } from "../repositories/query-repository/postsQueryRepository";

export const postsService = {
  async findPosts(): Promise<PostViewModel[]> {
    return await postsQueryRepository.findPosts();
  },
  async findPostById(id: string): Promise<PostViewModel | null> {
    return await postsQueryRepository.findPostById(id);
  },
  async createNewPost(body: PostInputModel): Promise<PostViewModel> {
    const { title, shortDescription, content, blogId } = body;
    const blog = await blogsService.findBlogById(blogId);
    const newPost: PostDBType = {
      title,
      shortDescription,
      content,
      blogId: new ObjectId(blogId),
      blogName: blog!.name,
      createdAt: creationDate,
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
