import { CustomValidator } from "express-validator";
import {
  stringInputValidatorCommon,
  stringsInputValidatorWithLength,
} from "../validators/commonValidator";
import { Types } from "mongoose";

export const isValidBlogId: CustomValidator = (blogId: string) => {
  if (!Types.ObjectId.isValid(blogId)) {
    throw new Error(
      "This blogId is invalid and doesn't fit the ObjectId 24 hex characters structure",
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
