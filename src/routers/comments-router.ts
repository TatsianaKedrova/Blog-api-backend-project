import express from "express";
import {
  deleteComment,
  getCommentById,
  updateComment,
} from "../controllers/commentsController";

export const commentsRouter = express.Router({});

commentsRouter.get("/:id", getCommentById);

commentsRouter.delete("/:commentId", deleteComment);

commentsRouter.put("/:commentId", updateComment);
