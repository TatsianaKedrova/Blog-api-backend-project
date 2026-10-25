import { model, Schema } from "mongoose";
import { PostDBType } from "../../../dto/postsDTO/postDTO";

export const postSchema = new Schema<PostDBType>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Blog",
      index: true,
    },
    blogName: { type: String, required: true },
    createdAt: { type: Date, required: true },
  },
  {
    versionKey: false,
  },
);
export const PostModel = model<PostDBType>("Post", postSchema, "posts");
