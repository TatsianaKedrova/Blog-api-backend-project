import { ObjectId } from "mongodb";
import { commentsCollection } from "../../db";
import { CommentViewModel } from "../../dto/commentsDTO/commentsDTO";

export const commentsRepository = {
  async findComment(id: string): Promise<CommentViewModel | null> {
    const comments = await commentsCollection.findOne({
      _id: new ObjectId(id),
    });
    return comments;
  },
};
