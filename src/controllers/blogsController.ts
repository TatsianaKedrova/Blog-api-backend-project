import { Response } from "express";
import { BlogInputModel, BlogViewModel } from "../dto/blogsDTO/BlogModel";
import { StatusCodes } from "http-status-codes";
import {
  RequestBodyModel,
  RequestQueryParamsModel,
  RequestWithURIParam,
  RequestWithURIParamAndQueryParam,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
import { TApiErrorResultObject } from "../dto/common/ErrorResponseModel";
import { BlogsService } from "../service/blogsService";
import { QueryParamsWithSearch } from "../dto/common/SortPaginatorQueryParamsType";
import { Paginator } from "../dto/common/PaginatorModel";
import { PostViewModel } from "../dto/postsDTO/PostModel";
import { BlogsQueryRepository } from "../repositories/query-repository/blogsQueryRepository";

export class BlogsController {
  constructor(
    protected readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}
  async getBlogs(
    req: RequestQueryParamsModel<QueryParamsWithSearch>,
    res: Response<Paginator<BlogViewModel>>,
  ) {
    let {
      searchNameTerm = "",
      pageNumber = 1,
      sortBy = "createdAt",
      pageSize = 10,
      sortDirection = "desc",
    } = req.query;

    const blogs: Paginator<BlogViewModel> =
      await this.blogsQueryRepository.findBlogs(
        searchNameTerm,
        Number(pageNumber),
        sortBy,
        Number(pageSize),
        sortDirection,
      );
    res.status(StatusCodes.OK).send(blogs);
  }
  async getBlogPosts(
    req: RequestWithURIParamAndQueryParam<
      URIParamsRequest,
      QueryParamsWithSearch
    >,
    res: Response<Paginator<PostViewModel>>,
  ) {
    let {
      pageNumber = 1,
      sortBy = "createdAt",
      pageSize = 10,
      sortDirection = "desc",
    } = req.query;

    const foundBlog = await this.blogsQueryRepository.findBlogById(
      req.params.id,
    );
    if (!foundBlog) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      const postsFromSpecificBlog =
        await this.blogsQueryRepository.findPostsForSpecificBlog(
          req.params.id,
          Number(pageNumber),
          sortBy,
          Number(pageSize),
          sortDirection,
        );
      res.status(StatusCodes.OK).send(postsFromSpecificBlog);
    }
  }
  async getBlogsById(
    req: RequestWithURIParam<URIParamsRequest>,
    res: Response<BlogViewModel>,
  ) {
    const foundBlog = await this.blogsQueryRepository.findBlogById(
      req.params.id,
    );
    if (!foundBlog) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      res.status(StatusCodes.OK).send(foundBlog);
    }
  }
  async createNewBlog(
    req: RequestBodyModel<BlogInputModel>,
    res: Response<BlogViewModel | TApiErrorResultObject>,
  ) {
    const newBlog = await this.blogsService.createNewBlog(req.body);
    res.status(StatusCodes.CREATED).send(newBlog);
  }
  async updateBlogById(
    req: RequestWithURIParamsAndBody<URIParamsRequest, BlogInputModel>,
    res: Response<TApiErrorResultObject>,
  ) {
    const updatedBlog = await this.blogsService.updateBlogById(
      req.params.id,
      req.body,
    );
    if (!updatedBlog) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      res.sendStatus(StatusCodes.NO_CONTENT);
    }
  }
  async deleteBlogById(
    req: RequestWithURIParam<URIParamsRequest>,
    res: Response,
  ) {
    const foundBlog = await this.blogsService.deleteBlogById(req.params.id);
    if (!foundBlog) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else res.sendStatus(StatusCodes.NO_CONTENT);
  }
}
