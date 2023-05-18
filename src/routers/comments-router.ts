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

export const commentsRouter = express.Router({});

commentsRouter.get("/:id", getCommentById);

commentsRouter.delete(
  "/:commentId",
  authMiddleware,
  forbiddenResponseMiddleware,
  deleteComment
);

commentsRouter.put(
  "/:commentId",
  authMiddleware,
  forbiddenResponseMiddleware,
  commentValidator,
  responseErrorValidationMiddleware,
  updateComment
);
