import { model, Schema } from "mongoose";
import { BlogDBType } from "../../../dto/blogsDTO/blogDTO";

export const blogSchema = new Schema<BlogDBType>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: Date, required: true },
    isMembership: { type: Boolean, required: true },
  },
  {
    versionKey: false,
  },
);

export const BlogModel = model<BlogDBType>("Blog", blogSchema, "blogs");
