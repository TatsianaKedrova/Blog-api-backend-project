import {
  BlogDBType,
  BlogInputModel,
  BlogViewModel,
} from "../dto/blogsDTO/BlogModel";

import { blogsCommandsRepository } from "../repositories/commands-repository/blogsCommandsRepository";
import { transformBlogsResponse } from "../utils/blogs-utils/transformBlogsResponse";
import { creationDate } from "../utils/common-utils/creation-publication-dates";

class BlogsService {
  async createNewBlog(body: BlogInputModel): Promise<BlogViewModel> {
    const { name, description, websiteUrl } = body;
    const newBlog = new BlogDBType({
      name,
      description,
      websiteUrl,
      createdAt: creationDate(),
      isMembership: false,
    });
    const createdBlogId = await blogsCommandsRepository.createNewBlog(newBlog);
    const blogTransformedResponse = transformBlogsResponse({
      ...newBlog,
      _id: createdBlogId,
    });
    return blogTransformedResponse;
  }
  async updateBlogById(id: string, body: BlogInputModel): Promise<boolean> {
    return await blogsCommandsRepository.updateBlogById(id, body);
  }
  async deleteBlogById(id: string): Promise<boolean> {
    return await blogsCommandsRepository.deleteBlogById(id);
  }
}

export const blogsService = new BlogsService();
