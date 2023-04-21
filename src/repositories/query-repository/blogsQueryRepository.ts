import { ObjectId } from "mongodb";
import { blogsCollection } from "../../db";
import { BlogDBType, BlogViewModel } from "../../dto/blogsDTO/BlogModel";
import { transformBlogsResponse } from "../../utils/blogs-utils/transformBlogsResponse";

export const blogsQueryRepository = {
  async findBlogs(): Promise<BlogViewModel[]> {
    //   const filter: any = {};
    //   if(title) {
    //     filter.title = {$regex: title}
    //   }
    //   return  return (await blogsCollection.find<BlogDBType>(filter).toArray()).map((doc) =>
    //   transformBlogsResponse(doc)
    // );
    // await blogsCollection.deleteMany({});
    return (await blogsCollection.find<BlogDBType>({}).toArray()).map((doc) =>
      transformBlogsResponse(doc)
    );
  },
  async findBlogById(id: string): Promise<BlogViewModel | null> {
    const foundBlog = await blogsCollection.findOne<BlogDBType>({
      _id: new ObjectId(id),
    });
    if (foundBlog) {
      return transformBlogsResponse(foundBlog);
    }
    return foundBlog;
  },
};
