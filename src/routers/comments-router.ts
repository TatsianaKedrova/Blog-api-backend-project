import { responseErrorValidationMiddleware } from "./../middlewares/responseErrorValidationMiddleware";
import express from "express";
import { accessTokenValidityMiddleware } from "../middlewares/accessTokenValidityMiddleware";
import { commentValidator } from "../utils/comments-utils/commentValidator";
import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";
import {
  commentsController,
  forbiddenResponseMiddleware,
} from "../inversify.config";
import { likesStatusValidator } from "../utils/comments-utils/likesStatusValidator";

export const commentsRouter = express.Router({});

commentsRouter.get(
  "/:id",
  validateObjectIdMiddleware,
  commentsController.getCommentById.bind(commentsController),
);

commentsRouter.delete(
  "/:id",
  accessTokenValidityMiddleware,
  validateObjectIdMiddleware,
  forbiddenResponseMiddleware,
  commentsController.deleteComment.bind(commentsController),
);

commentsRouter.put(
  "/:id",
  accessTokenValidityMiddleware,
  validateObjectIdMiddleware,
  forbiddenResponseMiddleware,
  commentValidator,
  responseErrorValidationMiddleware,
  commentsController.updateComment.bind(commentsController),
);
commentsRouter.put(
  "/:id/like-status",
  accessTokenValidityMiddleware,
  validateObjectIdMiddleware,
  likesStatusValidator,
  commentsController.changeLikeStatus.bind(commentsController),
);
