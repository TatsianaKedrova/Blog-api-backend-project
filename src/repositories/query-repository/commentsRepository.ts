import { transformComment } from "./../../utils/comments-utils/transformComment";
import { ObjectId } from "mongodb";
import { commentsCollection } from "../../db";
import { CommentViewModel } from "../../dto/commentsDTO/commentsDTO";

export const commentsRepository = {
  async findComment(id: string): Promise<CommentViewModel | null> {
    const comment = await commentsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!comment) {
      return null;
    } else {
      return transformComment(comment, id);
    }
  },
};
