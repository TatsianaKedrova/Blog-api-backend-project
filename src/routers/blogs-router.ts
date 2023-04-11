import { StatusCodes } from "http-status-codes";
import express, { Response } from "express";
import { db } from "../temporal-database/project-db";
import { BlogInputModel, BlogViewModel } from "../dto/blogsDTO/BlogViewModel";
import { blogsRepository } from "../repositories/blogs-repository";
import { TApiErrorResultObject } from "../dto/common/ErrorResponseModel";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
import {
  RequestBodyModel,
  RequestWithURIParam,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";
import { basicAuthMiddleware } from "../middlewares/basicAuth";
import { blogsValidator } from "../utils/blogsValidator/blogsValidator";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";
export const blogsRouter = express.Router({});

//TODO: GET LIST OF BLOGS
blogsRouter.get("/", (req, res: Response<BlogViewModel[]>) => {
  res.status(StatusCodes.OK).send(db.blogs);
});

//TODO: GET BLOG BY ID
blogsRouter.get(
  "/:id",
  (
    req: RequestWithURIParam<URIParamsRequest>,
    res: Response<BlogViewModel>
  ) => {
    const foundBlog = blogsRepository.findBlogById(req.params.id);
    if (!foundBlog) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      res.status(StatusCodes.OK).send(foundBlog);
    }
  }
);

//TODO: CREATE A NEW BLOG
blogsRouter.post(
  "/",
  basicAuthMiddleware,
  blogsValidator,
  responseErrorValidationMiddleware,
  (
    req: RequestBodyModel<BlogInputModel>,
    res: Response<BlogViewModel | TApiErrorResultObject>
  ) => {
    const newBlog = blogsRepository.createNewBlog(req.body);
    res.status(StatusCodes.CREATED).send(newBlog);
  }
);

//TODO: UPDATE BLOG BY ID
blogsRouter.put(
  "/:id",
  basicAuthMiddleware,
  blogsValidator,
  responseErrorValidationMiddleware,
  (
    req: RequestWithURIParamsAndBody<URIParamsRequest, BlogInputModel>,
    res: Response<TApiErrorResultObject>
  ) => {
    const updatedBlog = blogsRepository.updateBlogById(req.params.id, req.body);
    if (!updatedBlog) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    }

    res.sendStatus(StatusCodes.NO_CONTENT);
  }
);

//TODO: DELETE BLOG BY ID
blogsRouter.delete(
  "/:id",
  basicAuthMiddleware,
  (req: RequestWithURIParam<URIParamsRequest>, res: Response) => {
    const foundBlog = blogsRepository.deleteBlogById(req.params.id);
    if (!foundBlog) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    }
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
);
