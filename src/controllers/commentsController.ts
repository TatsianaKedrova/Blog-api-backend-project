import { Response } from "express";
import {
  CommentInputModel,
  CommentViewModel,
} from "../dto/commentsDTO/commentsDTO";
import {
  RequestWithURIParam,
  RequestWithURIParamAndQueryParam,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
import { StatusCodes } from "http-status-codes";
import { transformCommentsResponse } from "../utils/comments-utils/transformCommentsResponse";
import { PaginationSortingQueryParams } from "../dto/common/SortPaginatorQueryParamsType";
import { Paginator } from "../dto/common/PaginatorModel";
import { CommentsService } from "../service/commentsService";
import { CommentsQueryRepository } from "../repositories/query-repository/commentsQueryRepository";

export class CommentsController {
  constructor(
    protected readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  async createComment(
    req: RequestWithURIParamsAndBody<URIParamsRequest, CommentInputModel>,
    res: Response<CommentViewModel>,
  ) {
    const { content } = req.body;
    const createdComment = await this.commentsService.createNewComment(
      req.params.id,
      content,
      req.userId,
    );
    if (!createdComment) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      res.status(StatusCodes.CREATED).send(createdComment);
    }
  }
  async findCommentsForSpecifiedPost(
    req: RequestWithURIParamAndQueryParam<
      URIParamsRequest,
      PaginationSortingQueryParams
    >,
    res: Response<Paginator<CommentViewModel>>,
  ) {
    let {
      pageNumber = 1,
      sortBy = "createdAt",
      pageSize = 10,
      sortDirection = "desc",
    } = req.query;
    const commentsForSpecifiedPost =
      await this.commentsQueryRepository.findCommentsForSpecifiedPost(
        req.params.id,
        Number(pageNumber),
        sortBy,
        Number(pageSize),
        sortDirection,
      );
    if (!commentsForSpecifiedPost) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      res.status(StatusCodes.OK).send(commentsForSpecifiedPost);
    }
  }
  async getCommentById(
    req: RequestWithURIParam<URIParamsRequest>,
    res: Response<CommentViewModel>,
  ) {
    const foundComment = await this.commentsQueryRepository.findCommentById(
      req.params.id,
    );
    if (!foundComment) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      const transformedComment = transformCommentsResponse(foundComment);
      res.status(StatusCodes.OK).send(transformedComment);
    }
  }
  async deleteComment(
    req: RequestWithURIParam<URIParamsRequest>,
    res: Response,
  ) {
    const deletedComment = this.commentsService.deleteCommentById(
      req.params.id,
    );
    if (!deletedComment) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    }
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
  async updateComment(
    req: RequestWithURIParamsAndBody<URIParamsRequest, CommentInputModel>,
    res: Response,
  ) {
    const { content } = req.body;
    const updatedComment = await this.commentsService.updateCommentById(
      req.params.id,
      content,
    );
    if (!updatedComment) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    }
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
}
