import { CommentDBType } from "../../dto/commentsDTO/commentsDTO";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { CommentModel } from "../../db/mongoose/models/comments.model";
import { TYPES } from "../../constants/tokens";

@injectable()
export class CommentsCommandsRepository {
  constructor(
    @inject(TYPES.CommentModel)
    private readonly commentModel: typeof CommentModel,
  ) {}
  async createComment(
    newComment: Omit<CommentDBType, "_id">,
  ): Promise<Types.ObjectId> {
    const result = await this.commentModel.create(newComment);
    return result._id;
  }
  async deleteComment(commentId: string): Promise<boolean> {
    const deletedComment = await this.commentModel.deleteOne({
      _id: commentId,
    });
    return deletedComment.deletedCount === 1;
  }
  async updateCommentContent(
    commentId: string,
    content: string,
  ): Promise<boolean> {
    const newUpdatedComment = await this.commentModel.updateOne(
      { _id: commentId },
      { $set: { content } },
    );
    return newUpdatedComment.modifiedCount === 1;
  }
}
