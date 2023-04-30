import { CustomValidator, body } from "express-validator";
import { db } from "../../../temporal-database/project-db";
import { blogsCollection } from "../../../db";
import { ObjectId } from "mongodb";

/** This blogId validator is for hardcoded db */
export const isValidBlogIdHardcodedDB: CustomValidator = (blogId: string) => {
  const blog = db.blogs.find((blog) => blog.id === blogId);
  if (!blog) {
    throw new Error("Blog with such ID doesn't exist");
  }
  return true;
};

/** This blogId validator is for MONGO DB*/
export const isValidBlogId: CustomValidator = async (blogId: string) => {
  try {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(blogId) });
    if (!blog) {
      throw new Error("Blog with such ID doesn't exist");
    }
    return true;
  } catch (error) {
    throw new Error(
      "This blogId is invalid and doesn't fit the ObjectId 24 hex characters structure"
    );
  }
};

export const stringInputValidatorCommon = (field: string) => {
  return body(field)
    .exists()
    .withMessage(`${field} field is required`)
    .isString()
    .trim()
    .withMessage(`${field} should be of type String`)
    .notEmpty()
    .withMessage(`${field} must be included in request body`);
};

export const stringsInputValidator = (field: string, maxLength: number) => {
  return stringInputValidatorCommon(field)
    .isLength({ max: maxLength })
    .withMessage(`${field}'s max length is ${maxLength}`);
};

export const postsValidator = [
  stringsInputValidator("title", 30),
  stringsInputValidator("shortDescription", 100),
  stringsInputValidator("content", 1000),
  stringInputValidatorCommon("blogId").custom(isValidBlogId),
];

export const postsValidatorForSpecificBlog = [
  stringsInputValidator("title", 30),
  stringsInputValidator("shortDescription", 100),
  stringsInputValidator("content", 1000),
];
