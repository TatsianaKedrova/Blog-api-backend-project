import { responseErrorValidationMiddleware } from "./../middlewares/responseErrorValidationMiddleware";
import express from "express";
import {
  deleteComment,
  getCommentById,
  updateComment,
} from "../controllers/commentsController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { forbiddenResponseMiddleware } from "../middlewares/forbiddenResponseMiddleware";
import { commentValidator } from "../utils/comments-utils/commentValidator";
import { validateObjectIdMiddleware } from "../middlewares/validateObjectIdMiddleware";

export const commentsRouter = express.Router({});

commentsRouter.get("/:id", validateObjectIdMiddleware, getCommentById);

commentsRouter.delete(
  "/:id",
  authMiddleware,
  validateObjectIdMiddleware,
  forbiddenResponseMiddleware,
  deleteComment
);

commentsRouter.put(
  "/:id",
  authMiddleware,
  validateObjectIdMiddleware,
  forbiddenResponseMiddleware,
  commentValidator,
  responseErrorValidationMiddleware,
  updateComment
);
