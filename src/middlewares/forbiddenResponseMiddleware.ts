import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestWithURIParam } from "../dto/common/RequestModels";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
import { commentsQueryRepository } from "../repositories/query-repository/commentsQueryRepository";

export const forbiddenResponseMiddleware = async (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response,
  next: NextFunction,
) => {
  const comment = await commentsQueryRepository.findCommentById(req.params.id);
  if (!comment) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else if (comment && comment.commentatorInfo.userId !== req.userId) {
    res.sendStatus(StatusCodes.FORBIDDEN);
  } else {
    next();
  }
};
