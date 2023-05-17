import express from "express";
import { basicAuthMiddleware } from "../middlewares/basicAuth";
export const postsRouter = express.Router({});
import { postsValidator } from "../utils/posts-utils/postsValidator";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import {
  createComment,
  createNewPost,
  deletePostById,
  getPosts,
  getPostsById,
  updatePostById,
} from "../controllers/postsController";
import { validateObjectIdParams } from "../middlewares/validateObjectIdParams";
import { authMiddleware } from "../middlewares/authMiddleware";
import { commentValidator } from "../utils/comments-utils/commentValidator";

//TODO: GET LIST OF POSTS
postsRouter.get("/", getPosts);

//TODO: GET POST BY ID
postsRouter.get("/:id", validateObjectIdParams, getPostsById);

//TODO: CREATE A NEW POST
postsRouter.post(
  "/",
  basicAuthMiddleware,
  postsValidator,
  responseErrorValidationMiddleware,
  createNewPost
);

//TODO: UPDATE POST BY ID
postsRouter.put(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdParams,
  postsValidator,
  responseErrorValidationMiddleware,
  updatePostById
);

//TODO: DELETE POST BY ID
postsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdParams,
  deletePostById
);

//TODO: CREATE COMMENT FOR SPECIFIC POST
postsRouter.post(
  "/:postId/comments",
  authMiddleware,
  commentValidator,
  responseErrorValidationMiddleware,
  createComment
);
