import { BlogDBType, BlogViewModel } from "../../dto/blogsDTO/BlogModel";

export const transformBlogsResponse = (blog: BlogDBType): BlogViewModel => {
  return {
    id: blog._id?.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
  };
};
