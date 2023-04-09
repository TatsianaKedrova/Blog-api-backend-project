import { BlogInputModel, BlogViewModel } from "../dto/blogsDTO/BlogViewModel";
import { db } from "../temporal-database/project-db";
import { randomUUID } from "crypto";

export const blogsList = db.blogs;

export const blogsRepository = {
  getListOfBlogs() {
    return blogsList;
  },
  findBlogById(id: string): BlogViewModel | undefined {
    const foundBlogById = db.blogs.find((element) => element.id === id);
    return foundBlogById;
  },
  createNewBlog(body: BlogInputModel) {
    const { name, description, websiteUrl } = body;

    const newBlog: BlogViewModel = {
      id: randomUUID(),
      name,
      description,
      websiteUrl,
    };
    db.blogs.push(newBlog);
    return newBlog;
  },
  updateBlogById(id: string) {
    const foundBlog = db.blogs.find((blog) => blog.id === id);
    if (foundBlog) {
    }
    return foundBlog;
  },
  deleteBlogById(id: string): boolean {
    for (let i = 0; i < db.blogs.length; i++) {
      if (db.blogs[i].id === id) {
        db.blogs.splice(i, 1);
        return true;
      }
    }
    return false;
  },
};
