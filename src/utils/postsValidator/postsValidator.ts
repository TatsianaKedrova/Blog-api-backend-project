import { CustomValidator, body } from "express-validator";
import { db } from "../../temporal-database/project-db";

export const isValidBlogId: CustomValidator = (blogId: string) => {
  const blog = db.blogs.find((blog) => blog.id === blogId);
  if (!blog) {
    throw new Error("Blog with such ID doesn't exist");
  }
  return true;
};

export const stringsInputValidator = (field: string, maxLength: number) => {
  return body(field)
    .exists()
    .withMessage(`${field} field is required`)
    .isString()
    .trim()
    .withMessage(`${field} should be of type String`)
    .notEmpty()
    .withMessage(`${field} must be included in request body`)
    .isLength({ max: maxLength })
    .withMessage(`${field}'s max length is ${maxLength}`);
};

export const postsValidator = [
  stringsInputValidator("title", 30),
  stringsInputValidator("shortDescription", 100),
  stringsInputValidator("content", 1000),
  body("blogId").custom(isValidBlogId),
];
