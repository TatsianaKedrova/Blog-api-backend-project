import { Response } from "express";
import {
  CommentInputModel,
  CommentViewModel,
} from "../dto/commentsDTO/commentsDTO";
import {
  RequestWithURIParam,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
import { commentsQueryRepository } from "../repositories/query-repository/commentsQueryRepository";
import { StatusCodes } from "http-status-codes";
import { commentsService } from "../service/commentsService";
import { transformCommentsResponse } from "../utils/comments-utils/transformCommentsResponse";

export const getCommentById = async (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response<CommentViewModel>,
) => {
  const foundComment = await commentsQueryRepository.findCommentById(
    req.params.id,
  );
  if (!foundComment) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    const transformedComment = transformCommentsResponse(foundComment);
    res.status(StatusCodes.OK).send(transformedComment);
  }
};

export const deleteComment = async (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response,
) => {
  const deletedComment = commentsService.deleteCommentById(req.params.id);
  if (!deletedComment) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  }
  res.sendStatus(StatusCodes.NO_CONTENT);
};

export const updateComment = async (
  req: RequestWithURIParamsAndBody<URIParamsRequest, CommentInputModel>,
  res: Response,
) => {
  const { content } = req.body;
  const updatedComment = await commentsService.updateCommentById(
    req.params.id,
    content,
  );
  if (!updatedComment) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  }
  res.sendStatus(StatusCodes.NO_CONTENT);
};
