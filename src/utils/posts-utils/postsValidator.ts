import { CustomValidator } from "express-validator";
import {
  stringInputValidatorCommon,
  stringsInputValidatorWithLength,
} from "../validators/commonValidator";
import { BlogsModel } from "../../db/mongoose/models/blogs.model";
import { createAppError } from "../appErrors";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";

export const isValidBlogId: CustomValidator = async (blogId: string) => {
  if (!Types.ObjectId.isValid(blogId)) {
    throw new Error(
      "This blogId is invalid and doesn't fit the ObjectId 24 hex characters structure",
    );
  }
  const blog = await BlogsModel.findOne({ _id: blogId });
  if (!blog) {
    throw createAppError(
      "Blog with such ID doesn't exist",
      StatusCodes.NOT_FOUND,
    );
  }
  return true;
};

export const postsValidator = [
  stringsInputValidatorWithLength("title", 30),
  stringsInputValidatorWithLength("shortDescription", 100),
  stringsInputValidatorWithLength("content", 1000),
];

export const postsValidatorBlogId = [
  ...postsValidator,
  stringInputValidatorCommon("blogId").custom(isValidBlogId),
];
