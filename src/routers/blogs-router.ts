import { StatusCodes } from "http-status-codes";
import express, { Response } from "express";
import { db } from "../temporal-database/project-db";
import { BlogInputModel, BlogViewModel } from "../dto/blogsDTO/BlogViewModel";
import { blogsRepository } from "../repositories/blogs-repository";
import {
  TApiErrorResultObject,
} from "../dto/common/ErrorResponseModel";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
import {
  RequestBodyModel,
  RequestWithURIParam,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";
import { basicAuthMiddleware } from "../middlewares/basicAuth";
import { stringsInputValidator } from "../utils/postsValidator/postsValidator";
import { blogsURLValidator } from "../utils/blogsValidator/blogsValidator";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";
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
  inputValidationMiddleware,
  (
    req: RequestBodyModel<BlogInputModel>,
    res: Response<BlogViewModel | TApiErrorResultObject>
  ) => {
      res.set({
        "Content-Type": "application/json",
        Accept: "application/json",
      });
      const newBlog = blogsRepository.createNewBlog(req.body);
      res.status(StatusCodes.CREATED).send(newBlog);
    }
);

//TODO: UPDATE BLOG BY ID
blogsRouter.put(
  "/:id",
  stringsInputValidator("name", 15),
  stringsInputValidator("description", 500),
  blogsURLValidator(),
  inputValidationMiddleware,
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
  (req: RequestWithURIParam<URIParamsRequest>, res: Response) => {
    const foundBlog = blogsRepository.deleteBlogById(req.params.id);
    if (!foundBlog) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    }
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
);
