import { BlogInputModel, BlogViewModel } from "../dto/blogsDTO/BlogModel";
import { blogsCommandsRepository } from "../repositories/commands-repository/blogsCommandsRepository";
import { creationDate } from "../utils/common-utils/creation-publication-dates";

export const blogsService = {
  async createNewBlog(body: BlogInputModel): Promise<BlogViewModel> {
    const { name, description, websiteUrl } = body;
    const newBlog = {
      name,
      description,
      websiteUrl,
      createdAt: creationDate(),
      isMembership: false,
    };
    const result = await blogsCommandsRepository.createNewBlog(newBlog);
    return result;
  },
  async updateBlogById(id: string, body: BlogInputModel): Promise<boolean> {
    return await blogsCommandsRepository.updateBlogById(id, body);
  },
  async deleteBlogById(id: string): Promise<boolean> {
    return await blogsCommandsRepository.deleteBlogById(id);
  },
};
