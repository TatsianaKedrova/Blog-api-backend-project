import { StatusCodes } from "http-status-codes";
import express, { Response } from "express";
import { db } from "../temporal-database/project-db";
import { BlogInputModel, BlogViewModel } from "../dto/blogsDTO/BlogViewModel";
import { blogsRepository } from "../repositories/blogs-repository";
import {
  TApiErrorResultObject,
  TFieldError,
} from "../dto/common/ErrorResponseModel";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
import {
  RequestBodyModel,
  RequestWithURIParam,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";
import { responseErrorFunction } from "../utils/common-utils/responseErrorUtils";
import { basicAuthMiddleware } from "../middleware/basicAuth";
import { stringsInputValidator } from "../utils/postsValidator/postsValidator";
import {
  blogsURLValidator,
} from "../utils/blogsValidator/blogsValidator";
import { responseErrorTransformerFunction } from "../utils/common-utils/responseErrorTransformerUtil";
export const blogsRouter = express.Router({});

blogsRouter.use(basicAuthMiddleware);

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
  stringsInputValidator("name", 15),
  stringsInputValidator("description", 500),
  blogsURLValidator(),
  (
    req: RequestBodyModel<BlogInputModel>,
    res: Response<BlogViewModel | TApiErrorResultObject>
  ) => {
    const errors: TFieldError[] = responseErrorTransformerFunction(req);
    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(responseErrorFunction(errors));
    } else {
      res.set({
        "Content-Type": "application/json",
        Accept: "application/json",
      });
      const newBlog = blogsRepository.createNewBlog(req.body);
      res.status(StatusCodes.CREATED).send(newBlog);
    }
  }
);

//TODO: UPDATE BLOG BY ID
blogsRouter.put(
  "/:id",
  stringsInputValidator("name", 15),
  stringsInputValidator("description", 500),
  blogsURLValidator(),
  (
    req: RequestWithURIParamsAndBody<URIParamsRequest, BlogInputModel>,
    res: Response<TApiErrorResultObject>
  ) => {
    const errors: TFieldError[] = responseErrorTransformerFunction(req);
    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(responseErrorFunction(errors));
    }
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
  (req: RequestWithURIParam<URIParamsRequest>, res: Response) => {
    const foundBlog = blogsRepository.deleteBlogById(req.params.id);
    if (!foundBlog) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    }
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
);
