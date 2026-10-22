import { ObjectId } from "mongodb";
import { CommentDBType } from "../../dto/commentsDTO/commentsDTO";
import { injectable } from "inversify";
import { commentsCollection } from "../../db/nativeMongoDB/mongoDB";

@injectable()
export class CommentsCommandsRepository {
  async createComment(newComment: CommentDBType): Promise<ObjectId> {
    const result = await commentsCollection.insertOne(newComment);
    return result.insertedId;
  }
  async deleteComment(commentId: string): Promise<boolean> {
    const deletedComment = await commentsCollection.findOneAndDelete({
      _id: new ObjectId(commentId),
    });
    return deletedComment !== null;
  }
  async updateComment(commentId: string, content: string): Promise<boolean> {
    const newUpdatedComment = await commentsCollection.findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      { $set: { content } },
    );
    return newUpdatedComment !== null;
  }
}
