import { Response } from "express";
import { BlogDBType, BlogInputModel } from "../dto/blogsDTO/blogDTO";
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
import { PostViewModel } from "../dto/postsDTO/postDTO";
import { BlogsQueryRepository } from "../repositories/query-repository/blogsQueryRepository";
import { inject, injectable } from "inversify";
import { transformBlogsResponse } from "../utils/blogs-utils/transformBlogsResponse";

@injectable()
export class BlogsController {
  constructor(
    @inject(BlogsService) protected readonly blogsService: BlogsService,
    @inject(BlogsQueryRepository)
    private readonly blogsQueryRepository: BlogsQueryRepository,
  ) {}
  async getBlogs(
    req: RequestQueryParamsModel<QueryParamsWithSearch>,
    res: Response<Paginator<BlogDBType>>,
  ) {
    let {
      searchNameTerm = "",
      pageNumber = 1,
      sortBy = "createdAt",
      pageSize = 10,
      sortDirection = "desc",
    } = req.query;

    const blogs: Paginator<BlogDBType> =
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
    res: Response<BlogDBType>,
  ) {
    const foundBlog = await this.blogsQueryRepository.findBlogById(
      req.params.id,
    );
    if (!foundBlog) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      res.status(StatusCodes.OK).send(transformBlogsResponse(foundBlog));
    }
  }
  async createNewBlog(
    req: RequestBodyModel<BlogInputModel>,
    res: Response<BlogDBType | TApiErrorResultObject>,
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
