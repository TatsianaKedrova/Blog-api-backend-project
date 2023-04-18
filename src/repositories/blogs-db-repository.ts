import {
  BlogDBType,
  BlogInputModel,
  BlogViewModel,
} from "../dto/blogsDTO/BlogModel";
import { db } from "../temporal-database/project-db";
import { transformBlogsResponse } from "../utils/blogs-utils/transformBlogsResponse";
import { blogsCollection } from "./db";
import { ObjectId } from "mongodb";

export const blogsList = db.blogs;
export const blogsRepository = {
  async getListOfBlogs(): Promise<BlogViewModel[]> {
    return (await blogsCollection.find<BlogDBType>({}).toArray()).map((doc) =>
      transformBlogsResponse(doc)
    );
  },
  async findBlogById(id: string): Promise<BlogViewModel | null> {
    if (ObjectId.isValid(id)) {
      const foundBlog = await blogsCollection.findOne<BlogDBType>({
        _id: new ObjectId(id),
      });
      if (foundBlog) {
        return transformBlogsResponse(foundBlog);
      }
      return foundBlog;
    } else {
      return null;
    }
  },
  async createNewBlog(body: BlogInputModel): Promise<BlogViewModel> {
    const { name, description, websiteUrl } = body;
    const newBlog = {
      name,
      description,
      websiteUrl,
    };
    const result = await blogsCollection.insertOne(newBlog);

    return {
      description: newBlog.description,
      name: newBlog.name,
      websiteUrl: newBlog.websiteUrl,
      id: result.insertedId.toString(),
    };
  },
  async updateBlogById(id: string, body: BlogInputModel): Promise<boolean> {
    const { description, name, websiteUrl } = body;
    if (ObjectId.isValid(id)) {
      const foundBlog = await blogsCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!foundBlog) {
        return false;
      } else {
        await blogsCollection.updateOne(
          { _id: foundBlog._id },
          { $set: { name, description, websiteUrl } }
        );
        return true;
      }
    } else {
      return false;
    }
  },
  async deleteBlogById(id: string): Promise<boolean> {
    if (ObjectId.isValid(id)) {
      const deleteResult = await blogsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      if (deleteResult.deletedCount === 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  },
};
