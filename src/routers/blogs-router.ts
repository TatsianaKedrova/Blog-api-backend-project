import express from "express";

import { basicAuthMiddleware } from "../middlewares/basicAuth";
import { blogsValidator } from "../utils/blogs-utils/blogs-validator/blogsValidator";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import {
  createNewBlog,
  createPostForSpecificBlog,
  deleteBlogById,
  getBlogPosts,
  getBlogs,
  getBlogsById,
  updateBlogById,
} from "../controllers/blogsController";
import { validateObjectIdParams } from "../middlewares/validateObjectIdParams";
import { stringsInputValidator } from "../utils/posts-utils/posts-validator/postsValidator";
export const blogsRouter = express.Router({});

//TODO: GET LIST OF BLOGS
blogsRouter.get("/", getBlogs);

blogsRouter.get("/:id/posts", validateObjectIdParams, getBlogPosts as any);

//TODO: GET BLOG BY ID
blogsRouter.get("/:id", validateObjectIdParams, getBlogsById);

blogsRouter.post(
  "/:id/posts",
  basicAuthMiddleware,
  stringsInputValidator("title", 30),
  stringsInputValidator("shortDescription", 100),
  stringsInputValidator("content", 1000),
  createPostForSpecificBlog
);

//TODO: CREATE A NEW BLOG
blogsRouter.post(
  "/",
  basicAuthMiddleware,
  blogsValidator,
  responseErrorValidationMiddleware,
  createNewBlog
);

//TODO: UPDATE BLOG BY ID
blogsRouter.put(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdParams,
  blogsValidator,
  responseErrorValidationMiddleware,
  updateBlogById
);

//TODO: DELETE BLOG BY ID
blogsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdParams,
  deleteBlogById
);
