import {
  PostDBType,
  PostInputModel,
  PostViewModel,
} from "../dto/postsDTO/PostModel";
import { blogsService } from "./blogs-service";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import { ObjectId } from "mongodb";
import { postsRepository } from "../repositories/posts-db-repository";

export const postsService = {
  async findPosts(): Promise<PostViewModel[]> {
    return await postsRepository.findPosts();
  },
  async findPostById(id: string): Promise<PostViewModel | null> {
    return await postsRepository.findPostById(id);
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
    return await postsRepository.createNewPost(newPost);
  },
  async updatePostById(id: string, body: PostInputModel): Promise<boolean> {
    return await postsRepository.updatePostById(id, body);
  },
  async deletePostById(id: string): Promise<boolean> {
    return await postsRepository.deletePostById(id);
  },
};
