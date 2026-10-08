import {
  BlogDBType,
  BlogInputModel,
  BlogViewModel,
} from "../dto/blogsDTO/BlogModel";
import { BlogsCommandsRepository } from "../repositories/commands-repository/blogsCommandsRepository";

import { transformBlogsResponse } from "../utils/blogs-utils/transformBlogsResponse";
import { creationDate } from "../utils/common-utils/creation-publication-dates";

export class BlogsService {
  constructor(
    private readonly blogsCommandsRepository: BlogsCommandsRepository,
  ) {}
  async createNewBlog(body: BlogInputModel): Promise<BlogViewModel> {
    const { name, description, websiteUrl } = body;
    const newBlog = new BlogDBType({
      name,
      description,
      websiteUrl,
      createdAt: creationDate(),
      isMembership: false,
    });
    const createdBlogId =
      await this.blogsCommandsRepository.createNewBlog(newBlog);
    const blogTransformedResponse = transformBlogsResponse({
      ...newBlog,
      _id: createdBlogId,
    });
    return blogTransformedResponse;
  }
  async updateBlogById(id: string, body: BlogInputModel): Promise<boolean> {
    return await this.blogsCommandsRepository.updateBlogById(id, body);
  }
  async deleteBlogById(id: string): Promise<boolean> {
    return await this.blogsCommandsRepository.deleteBlogById(id);
  }
}
