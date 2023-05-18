import express from "express";

import { basicAuthMiddleware } from "../middlewares/basicAuth";
import { blogsValidator } from "../utils/blogs-utils/blogsValidator";
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
import { postsValidatorForSpecificBlog } from "../utils/posts-utils/postsValidator";
export const blogsRouter = express.Router({});

//TODO: GET LIST OF BLOGS
blogsRouter.get("/", getBlogs);
//TODO: GET BLOG BY ID
blogsRouter.get("/:id", validateObjectIdParams, getBlogsById);
//TODO: GET ALL POSTS FOR SPECIFIC BLOG
blogsRouter.get("/:id/posts", validateObjectIdParams, getBlogPosts);

//TODO: CREATE POST FOR SPECIFIC BLOG
blogsRouter.post(
  "/:id/posts",
  basicAuthMiddleware,
  postsValidatorForSpecificBlog,
  responseErrorValidationMiddleware,
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
