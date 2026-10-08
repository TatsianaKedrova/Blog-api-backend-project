import express from "express";
import { basicAuthMiddleware } from "../middlewares/basicAuth";
import { postsValidator } from "../utils/posts-utils/postsValidator";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";

import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";
import { accessTokenValidityMiddleware } from "../middlewares/accessTokenValidityMiddleware";
import { commentValidator } from "../utils/comments-utils/commentValidator";
import { commentsController, postsController } from "../composition-route";
export const postsRouter = express.Router({});

//TODO: GET LIST OF POSTS
postsRouter.get("/", postsController.getPosts.bind(postsController));

//TODO: GET POST BY ID
postsRouter.get(
  "/:id",
  validateObjectIdMiddleware,
  postsController.getPostsById.bind(postsController),
);

//TODO: CREATE A NEW POST
postsRouter.post(
  "/",
  basicAuthMiddleware,
  postsValidator,
  responseErrorValidationMiddleware,
  postsController.createNewPost.bind(postsController),
);

//TODO: UPDATE POST BY ID
postsRouter.put(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  postsValidator,
  responseErrorValidationMiddleware,
  postsController.updatePostById.bind(postsController),
);

//TODO: DELETE POST BY ID
postsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  validateObjectIdMiddleware,
  postsController.deletePostById.bind(postsController),
);

//TODO: CREATE COMMENT FOR SPECIFIC POST
postsRouter.post(
  "/:id/comments",
  accessTokenValidityMiddleware,
  validateObjectIdMiddleware,
  commentValidator,
  responseErrorValidationMiddleware,
  commentsController.createComment.bind(commentsController),
);

//TODO: RETURN COMMENTS FOR SPECIFIED POST
postsRouter.get(
  "/:id/comments",
  validateObjectIdMiddleware,
  commentsController.findCommentsForSpecifiedPost.bind(commentsController),
);
