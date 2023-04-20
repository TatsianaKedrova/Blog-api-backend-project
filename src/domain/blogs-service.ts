import { BlogInputModel, BlogViewModel } from "../dto/blogsDTO/BlogModel";
import { creationDate } from "../utils/common-utils/creation-publication-dates";
import { blogsRepository } from "../repositories/blogs-db-repository";

export const blogsService = {
  async findBlogs(): Promise<BlogViewModel[]> {
    return await blogsRepository.findBlogs();
  },
  async findBlogById(id: string): Promise<BlogViewModel | null> {
    return await blogsRepository.findBlogById(id);
  },
  async createNewBlog(body: BlogInputModel): Promise<BlogViewModel> {
    const { name, description, websiteUrl } = body;
    const newBlog = {
      name,
      description,
      websiteUrl,
      createdAt: creationDate,
      isMembership: false,
    };
    const result = await blogsRepository.createNewBlog(newBlog);
    return result;
  },
  async updateBlogById(id: string, body: BlogInputModel): Promise<boolean> {
    return await blogsRepository.updateBlogById(id, body);
  },
  async deleteBlogById(id: string): Promise<boolean> {
    return await blogsRepository.deleteBlogById(id);
  },
};
