import { ObjectId } from "mongodb";
import { commentsCollection } from "../../db";
import {
  CommentDBType,
  CommentViewModel,
} from "../../dto/commentsDTO/commentsDTO";
import { transformComment } from "../../utils/comments-utils/transformComment";
export const commentsCommandsRepository = {
  async createComment(newComment: CommentDBType): Promise<CommentViewModel> {
    const result = await commentsCollection.insertOne(newComment);

    return transformComment(newComment, result.insertedId.toString());
  },
  async _findComment(id: string) {
    const comments = await commentsCollection.findOne({
      _id: new ObjectId(id),
    });
    return comments;
  },
  async deleteComment(commentId: string): Promise<boolean> {
    const foundComment = this._findComment(commentId);
    if (!foundComment) {
      return false;
    } else {
      const deletedComment = await commentsCollection.deleteOne({
        _id: new ObjectId(commentId),
      });
      return deletedComment.deletedCount === 1;
    }
  },
  async updateComment(commentId: string, content: string): Promise<boolean> {
    const foundComment = this._findComment(commentId);
    if (!foundComment) {
      return false;
    } else {
      const updatedComment = await commentsCollection.updateOne(
        { _id: new ObjectId(commentId) },
        { $set: { content } }
      );
      return updatedComment.modifiedCount === 1;
    }
  },
};
