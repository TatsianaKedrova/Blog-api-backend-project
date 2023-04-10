import { CustomValidator, body } from "express-validator";
import { db } from "../../temporal-database/project-db";
import { NextFunction, Request, Response } from "express";

export const isValidBlogId: CustomValidator = (blogId: string) => {
  const blogNameValue = db.blogs.find((blog) => blog.id === blogId);
  if (!blogNameValue) {
    return Promise.reject("blogId with this value doesn't exist");
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


//?This function doesn't show errors - need to check it again later
// export const postsValidator = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   stringsInputValidator("title", 30);
//   stringsInputValidator("shortDescription", 100);
//   stringsInputValidator("content", 1000);
//   body("blogId").custom(isValidBlogId);
//   next();
// };
