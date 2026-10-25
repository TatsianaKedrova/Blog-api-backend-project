import { PostDBType, PostInputModel } from "../../dto/postsDTO/postDTO";
import { injectable } from "inversify";
import { PostModel } from "../../db/mongoose/models/post.model";
import { Types } from "mongoose";

@injectable()
export class PostsCommandsRepository {
  async createNewPost(
    newPost: Omit<PostDBType, "_id">,
  ): Promise<Types.ObjectId> {
    const result = await PostModel.create(newPost);
    return result._id;
  }
  async updatePostById(
    id: string,
    body: PostInputModel,
    blogName: string,
  ): Promise<boolean> {
    const updatedResult = await PostModel.updateOne(
      { _id: id },
      {
        $set: {
          ...body,
          blogName,
        },
      },
    );
    return updatedResult.matchedCount === 1;
  }

  async deletePostById(id: string): Promise<boolean> {
    const deleteResult = await PostModel.deleteOne({
      _id: id,
    });
    return deleteResult.deletedCount === 1;
  }
}
