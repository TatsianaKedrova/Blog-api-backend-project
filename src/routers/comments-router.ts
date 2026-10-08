import { responseErrorValidationMiddleware } from "./../middlewares/responseErrorValidationMiddleware";
import express from "express";
import { accessTokenValidityMiddleware } from "../middlewares/accessTokenValidityMiddleware";
import { commentValidator } from "../utils/comments-utils/commentValidator";
import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";
import {
  commentsController,
  forbiddenResponseMiddleware,
} from "../composition-route";

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
