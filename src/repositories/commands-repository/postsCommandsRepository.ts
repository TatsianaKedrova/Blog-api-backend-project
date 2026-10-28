import { PostDBType, PostInputModel } from "../../dto/postsDTO/postDTO";
import { inject, injectable } from "inversify";
import { PostModel } from "../../db/mongoose/models/post.model";
import { Model, Types } from "mongoose";

@injectable()
export class PostsCommandsRepository {
  constructor(
    @inject(PostModel) private readonly postModel: Model<PostDBType>,
  ) {}
  async createNewPost(
    newPost: Omit<PostDBType, "_id">,
  ): Promise<Types.ObjectId> {
    const result = await this.postModel.create(newPost);
    return result._id;
  }
  async updatePostById(
    id: string,
    updatedPayload: Omit<PostInputModel, "blogId">,
  ): Promise<boolean> {
    const updatedResult = await this.postModel.updateOne(
      { _id: id },
      {
        $set: {
          ...updatedPayload,
        },
      },
    );
    return updatedResult.matchedCount === 1;
  }

  async deletePostById(id: string): Promise<boolean> {
    const deleteResult = await this.postModel.deleteOne({
      _id: id,
    });
    return deleteResult.deletedCount === 1;
  }
}
