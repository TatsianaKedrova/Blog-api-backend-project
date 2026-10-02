import { responseErrorValidationMiddleware } from "./../middlewares/responseErrorValidationMiddleware";
import express from "express";
import { accessTokenValidityMiddleware } from "../middlewares/accessTokenValidityMiddleware";
import { forbiddenResponseMiddleware } from "../middlewares/forbiddenResponseMiddleware";
import { commentValidator } from "../utils/comments-utils/commentValidator";
import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";
import { commentsController } from "../controllers/commentsController";

export const commentsRouter = express.Router({});

commentsRouter.get(
  "/:id",
  validateObjectIdMiddleware,
  commentsController.getCommentById,
);

commentsRouter.delete(
  "/:id",
  accessTokenValidityMiddleware,
  validateObjectIdMiddleware,
  forbiddenResponseMiddleware,
  commentsController.deleteComment,
);

commentsRouter.put(
  "/:id",
  accessTokenValidityMiddleware,
  validateObjectIdMiddleware,
  forbiddenResponseMiddleware,
  commentValidator,
  responseErrorValidationMiddleware,
  commentsController.updateComment,
);
