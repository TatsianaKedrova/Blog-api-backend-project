import { Response } from "express";
import {
  CommentInputModel,
  CommentViewModel,
} from "../dto/commentsDTO/commentsDTO";
import {
  RequestWithURIParam,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";
import {
  URIParamsCommentId,
  URIParamsRequest,
} from "../dto/common/URIParamsRequest";
import { commentsRepository } from "../repositories/query-repository/commentsRepository";
import { StatusCodes } from "http-status-codes";
import { commentsService } from "../domain/comments-service";

export const getComments = async (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response<CommentViewModel>
) => {
  const foundComment = await commentsRepository.findComment(req.params.id);
  if (!foundComment) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.status(StatusCodes.OK).send(foundComment);
  }
};

export const deleteComment = async (
  req: RequestWithURIParam<URIParamsCommentId>,
  res: Response
) => {
  const deletedComment = commentsService.deleteCommentById(
    req.params.commentId
  );
  if (!deletedComment) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
};

export const updateComment = async (
  req: RequestWithURIParamsAndBody<URIParamsCommentId, CommentInputModel>,
  res: Response
) => {
  const { content } = req.body;
  const updatedComment = await commentsService.updateCommentById(
    req.params.commentId,
    content
  );
  if (!updatedComment) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
};