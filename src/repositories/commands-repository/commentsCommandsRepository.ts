import { CommentDBType } from "../../dto/commentsDTO/commentsDTO";
import { injectable } from "inversify";
import { Types } from "mongoose";
import { CommentModel } from "../../db/mongoose/models/comments.model";

@injectable()
export class CommentsCommandsRepository {
  async createComment(
    newComment: Omit<CommentDBType, "_id">,
  ): Promise<Types.ObjectId> {
    const result = await CommentModel.create(newComment);
    return result._id;
  }
  async deleteComment(commentId: string): Promise<boolean> {
    const deletedComment = await CommentModel.deleteOne({
      _id: commentId,
    });
    return deletedComment.deletedCount === 1;
  }
  async updateComment(commentId: string, content: string): Promise<boolean> {
    const newUpdatedComment = await CommentModel.updateOne(
      { _id: commentId },
      { $set: { content } },
    );
    return newUpdatedComment.modifiedCount === 1;
  }
}
