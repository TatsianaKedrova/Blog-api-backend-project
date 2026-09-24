import { NextFunction, Request, Response } from "express";
import { commentsCommandsRepository } from "../repositories/commands-repository/commentsCommandsRepository";
import { StatusCodes } from "http-status-codes";
import { RequestWithURIParam } from "../dto/common/RequestModels";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";

export const forbiddenResponseMiddleware = async (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response,
  next: NextFunction,
) => {
  const comment = await commentsCommandsRepository.findCommentById(
    req.params.id,
  );
  if (!comment) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else if (comment && comment.commentatorInfo.userId !== req.userId) {
    res.sendStatus(StatusCodes.FORBIDDEN);
  } else {
    next();
  }
};
