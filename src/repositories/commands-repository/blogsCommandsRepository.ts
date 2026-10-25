import { injectable } from "inversify";
import { BlogDBType, BlogInputModel } from "../../dto/blogsDTO/blogDTO";
import { BlogsModel } from "../../db/mongoose/models/blogs.model";
import { Types } from "mongoose";

@injectable()
export class BlogsCommandsRepository {
  async createNewBlog(
    newBlog: Omit<BlogDBType, "_id">,
  ): Promise<Types.ObjectId> {
    const result = await BlogsModel.create(newBlog);
    return result._id;
  }
  async updateBlogById(id: string, body: BlogInputModel): Promise<boolean> {
    const updatedResult = await BlogsModel.updateOne(
      { _id: id },
      { $set: body },
    );
    return updatedResult.matchedCount === 1;
  }

  async deleteBlogById(id: string): Promise<boolean> {
    const deleteResult = await BlogsModel.deleteOne({
      _id: id,
    });
    return deleteResult.deletedCount === 1;
  }
}
