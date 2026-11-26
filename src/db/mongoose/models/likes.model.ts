import { model, Schema } from "mongoose";
import { LIKE_STATUSES, LikesDBType } from "../../../dto/commentsDTO/likesDTO";

export const likesSchema = new Schema<LikesDBType>(
  {
    commentId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    likesStatus: { type: String, enum: [...LIKE_STATUSES], required: true },
    createdAt: { type: Date, required: true, default: Date.now },
  },
  {
    versionKey: false,
  },
);
likesSchema.index({ commentId: 1, userId: 1 }, { unique: true });

export const LikeDislikeModel = model<LikesDBType>(
  "LikeDislike",
  likesSchema,
  "likesDislikes",
);
