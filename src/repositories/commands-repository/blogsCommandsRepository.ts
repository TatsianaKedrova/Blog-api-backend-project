import { inject, injectable } from "inversify";
import { BlogDBType, BlogInputModel } from "../../dto/blogsDTO/blogDTO";
import { BlogModel } from "../../db/mongoose/models/blog.model";
import { Types } from "mongoose";

@injectable()
export class BlogsCommandsRepository {
  constructor(
    @inject(BlogModel) private readonly blogModel: typeof BlogModel,
  ) {}
  async createNewBlog(
    newBlog: Omit<BlogDBType, "_id">,
  ): Promise<Types.ObjectId> {
    const result = await this.blogModel.create(newBlog);
    return result._id;
  }
  async updateBlogById(id: string, body: BlogInputModel): Promise<boolean> {
    const updatedResult = await this.blogModel.updateOne(
      { _id: id },
      { $set: body },
    );
    return updatedResult.matchedCount === 1;
  }

  async deleteBlogById(id: string): Promise<boolean> {
    const deleteResult = await this.blogModel.deleteOne({
      _id: id,
    });
    return deleteResult.deletedCount === 1;
  }
}
