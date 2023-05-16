import express from "express";
import {
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/commentsController";

export const commentsRouter = express.Router({});

commentsRouter.get("/:id", getComments);

commentsRouter.delete("/:commentId", deleteComment);

commentsRouter.put("/:commentId", updateComment);
