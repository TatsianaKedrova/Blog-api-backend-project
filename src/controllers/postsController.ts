import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  CreatePostForSpecificBlogType,
  PostInputModel,
  PostViewModel,
} from "../dto/postsDTO/PostModel";
import { postsService } from "../service/postsService";
import {
  RequestBodyModel,
  RequestQueryParamsModel,
  RequestWithURIParam,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
import { TApiErrorResultObject } from "../dto/common/ErrorResponseModel";
import { postsQueryRepository } from "../repositories/query-repository/postsQueryRepository";
import { Paginator } from "../dto/common/PaginatorModel";
import { QueryParamsWithSearch } from "../dto/common/SortPaginatorQueryParamsType";
import { transformPostsResponse } from "../utils/posts-utils/transformPostsResponse";

class PostsController {
  async getPosts(
    req: RequestQueryParamsModel<QueryParamsWithSearch>,
    res: Response<Paginator<PostViewModel>>,
  ) {
    let {
      pageNumber = 1,
      sortBy = "createdAt",
      pageSize = 10,
      sortDirection = "desc",
    } = req.query;
    const posts: Paginator<PostViewModel> =
      await postsQueryRepository.findPosts(
        Number(pageNumber),
        sortBy,
        Number(pageSize),
        sortDirection,
      );
    res.status(StatusCodes.OK).send(posts);
  }
  async getPostsById(
    req: RequestWithURIParam<URIParamsRequest>,
    res: Response<PostViewModel>,
  ) {
    const foundPost = await postsQueryRepository.findPostById(req.params.id);
    if (!foundPost) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      const transformedPost = transformPostsResponse(foundPost);
      res.status(StatusCodes.OK).send(transformedPost);
    }
  }
  async createNewPost(
    req: RequestBodyModel<PostInputModel>,
    res: Response<PostViewModel | TApiErrorResultObject>,
  ) {
    const newPost = await postsService.createNewPost(req.body.blogId, req.body);
    if (!newPost) {
      res.sendStatus(StatusCodes.CONFLICT);
    } else {
      res.status(StatusCodes.CREATED).send(newPost);
    }
  }
  async createPostForSpecificBlog(
    req: RequestWithURIParamsAndBody<
      URIParamsRequest,
      CreatePostForSpecificBlogType
    >,
    res: Response<PostViewModel>,
  ) {
    const createdPost = await postsService.createNewPost(
      req.params.id,
      req.body,
    );
    if (!createdPost) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else res.status(StatusCodes.CREATED).send(createdPost);
  }
  async updatePostById(
    req: RequestWithURIParamsAndBody<URIParamsRequest, PostInputModel>,
    res: Response<TApiErrorResultObject>,
  ) {
    const isUpdated = await postsService.updatePostById(
      req.params.id,
      req.body,
    );
    if (!isUpdated) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      res.sendStatus(StatusCodes.NO_CONTENT);
    }
  }
  async deletePostById(
    req: RequestWithURIParam<URIParamsRequest>,
    res: Response,
  ) {
    const isDeleted = await postsService.deletePostById(req.params.id);

    if (!isDeleted) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      res.sendStatus(StatusCodes.NO_CONTENT);
    }
  }
}

export const postsController = new PostsController();
