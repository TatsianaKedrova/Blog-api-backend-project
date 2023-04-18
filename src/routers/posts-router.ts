import express from "express";
import { basicAuthMiddleware } from "../middlewares/basicAuth";
export const postsRouter = express.Router({});
import { postsValidator } from "../utils/posts-validator/postsValidator";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
import {
  createNewPost,
  deletePostById,
  getPosts,
  getPostsById,
  updatePostById,
} from "../controllers/postsController";

//TODO: GET LIST OF POSTS
postsRouter.get("/", getPosts);

//TODO: GET POST BY ID
postsRouter.get("/:id", getPostsById);

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
  postsValidator,
  responseErrorValidationMiddleware,
  updatePostById
);

//TODO: DELETE POST BY ID
postsRouter.delete("/:id", basicAuthMiddleware, deletePostById);
