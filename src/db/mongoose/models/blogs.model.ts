import { model, Schema } from "mongoose";
import { BlogDBType } from "../../../dto/blogsDTO/blogDTO";

export const blogsSchema = new Schema<BlogDBType>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: Date, required: true },
  isMembership: { type: Boolean, required: true },
});

export const BlogsModel = model<BlogDBType>("Blogs", blogsSchema, "blogs");
