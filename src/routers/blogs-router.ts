import express from "express";

import { basicAuthMiddleware } from "../middlewares/basicAuth";
import { blogsValidator } from "../utils/blogs-utils/blogsValidator";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";

import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";
import { postsValidatorForSpecificBlog } from "../utils/posts-utils/postsValidator";
import { blogsController, postsController } from "../composition-route";
export const blogsRouter = express.Router({});

//TODO: GET LIST OF BLOGS
blogsRouter.get("/", blogsController.getBlogs.bind(blogsController));
//TODO: GET BLOG BY ID
blogsRouter.get(
  "/:id",
  validateObjectIdMiddleware,
  blogsController.getBlogsById.bind(blogsController),
);
//TODO: GET ALL POSTS FOR SPECIFIC BLOG
blogsRouter.get(
  "/:id/posts",
  validateObjectIdMiddleware,
  blogsController.getBlogPosts.bind(blogsController),
);

//TODO: CREATE POST FOR SPECIFIC BLOG
blogsRouter.post(
  "/:id/posts",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  postsValidatorForSpecificBlog,
  responseErrorValidationMiddleware,
  postsController.createNewPost.bind(postsController),
);
//TODO: CREATE A NEW BLOG
blogsRouter.post(
  "/",
  basicAuthMiddleware,
  blogsValidator,
  responseErrorValidationMiddleware,
  blogsController.createNewBlog.bind(blogsController),
);

//TODO: UPDATE BLOG BY ID
blogsRouter.put(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  blogsValidator,
  responseErrorValidationMiddleware,
  blogsController.updateBlogById.bind(blogsController),
);

//TODO: DELETE BLOG BY ID
blogsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  blogsController.deleteBlogById.bind(blogsController),
);
