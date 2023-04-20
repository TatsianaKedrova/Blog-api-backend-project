import { blogsCollection } from "../db";
import {
  BlogDBType,
  BlogInputModel,
  BlogViewModel,
} from "../dto/blogsDTO/BlogModel";
import { transformBlogsResponse } from "../utils/blogs-utils/transformBlogsResponse";
import { ObjectId } from "mongodb";

export const blogsRepository = {
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
  async createNewBlog(newBlog: BlogDBType): Promise<BlogViewModel> {
    const result = await blogsCollection.insertOne(newBlog);

    return transformBlogsResponse(newBlog, result.insertedId.toString());
  },
  async updateBlogById(id: string, body: BlogInputModel): Promise<boolean> {
    const { description, name, websiteUrl } = body;
    const foundBlog = await blogsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!foundBlog) {
      return false;
    } else {
      const updatedResult = await blogsCollection.updateOne(
        { _id: foundBlog._id },
        { $set: { name, description, websiteUrl } }
      );
      return updatedResult.matchedCount === 1;
    }
  },
  async deleteBlogById(id: string): Promise<boolean> {
    const deleteResult = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  },
};
