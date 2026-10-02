import express from "express";

import { basicAuthMiddleware } from "../middlewares/basicAuth";
import { blogsValidator } from "../utils/blogs-utils/blogsValidator";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";

import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";
import { postsValidatorForSpecificBlog } from "../utils/posts-utils/postsValidator";
import { postsController } from "../controllers/postsController";
import { blogsController } from "../controllers/blogsController";
export const blogsRouter = express.Router({});

//TODO: GET LIST OF BLOGS
blogsRouter.get("/", blogsController.getBlogs);
//TODO: GET BLOG BY ID
blogsRouter.get(
  "/:id",
  validateObjectIdMiddleware,
  blogsController.getBlogsById,
);
//TODO: GET ALL POSTS FOR SPECIFIC BLOG
blogsRouter.get(
  "/:id/posts",
  validateObjectIdMiddleware,
  blogsController.getBlogPosts,
);

//TODO: CREATE POST FOR SPECIFIC BLOG
blogsRouter.post(
  "/:id/posts",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  postsValidatorForSpecificBlog,
  responseErrorValidationMiddleware,
  postsController.createNewPost,
);
//TODO: CREATE A NEW BLOG
blogsRouter.post(
  "/",
  basicAuthMiddleware,
  blogsValidator,
  responseErrorValidationMiddleware,
  blogsController.createNewBlog,
);

//TODO: UPDATE BLOG BY ID
blogsRouter.put(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  blogsValidator,
  responseErrorValidationMiddleware,
  blogsController.updateBlogById,
);

//TODO: DELETE BLOG BY ID
blogsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  blogsController.deleteBlogById,
);
