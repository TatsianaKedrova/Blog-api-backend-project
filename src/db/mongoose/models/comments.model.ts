import { model, Schema, Types } from "mongoose";
import { CommentDBType } from "../../../dto/commentsDTO/commentsDTO";

export const commentsSchema = new Schema<CommentDBType>({
  _id: { type: Types.ObjectId, required: true },
  content: { type: String, required: true },
  userId: { type: Types.ObjectId, required: true, index: true},
  userLogin: { type: String, required: true },
  createdAt: { type: Date, required: true },
  postId: { type: Types.ObjectId, required: true, index: true },
});
export const CommentModel = model<CommentDBType>(
  "Comment",
  commentsSchema,
  "comments",
);
