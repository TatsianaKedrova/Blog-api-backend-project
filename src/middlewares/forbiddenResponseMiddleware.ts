import { NextFunction, Request, Response } from "express";
import { commentsCommandsRepository } from "../repositories/commands-repository/commentsCommandsRepository";
import { StatusCodes } from "http-status-codes";

export const forbiddenResponseMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const comment = await commentsCommandsRepository.findCommentById(
    req.params.commentId
  );
  if (comment && comment.commentatorInfo.userId === req.user._id.toString()) {
    next();
  } else {
    res.sendStatus(StatusCodes.FORBIDDEN);
  }
};
