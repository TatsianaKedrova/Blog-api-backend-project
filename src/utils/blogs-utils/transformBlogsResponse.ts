import { WithId } from "mongodb";
import { BlogDBType, BlogViewModel } from "../../dto/blogsDTO/blogDTO";

export const transformBlogsResponse = (
  blog: WithId<BlogDBType>,
): BlogViewModel => {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt.toISOString(),
    isMembership: blog.isMembership,
  };
};
