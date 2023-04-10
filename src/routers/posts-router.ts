import express, { Response } from "express";
import { PostInputModel, PostViewModel } from "../dto/postsDTO/PostViewModel";
import { StatusCodes } from "http-status-codes";
import { db } from "../temporal-database/project-db";
import { postsRepository } from "../repositories/posts-repository";
import { TApiErrorResultObject } from "../dto/common/ErrorResponseModel";
import {
  RequestBodyModel,
  RequestWithURIParam,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
import { basicAuthMiddleware } from "../middlewares/basicAuth";
export const postsRouter = express.Router({});
import {
  isValidBlogId,
  stringsInputValidator,
} from "../utils/postsValidator/postsValidator";
import { body } from "express-validator";
import { inputValidationMiddleware } from "../middlewares/input-validation-middleware";

postsRouter.use(basicAuthMiddleware);

//TODO: GET LIST OF POSTS
postsRouter.get("/", (req, res: Response<PostViewModel[]>) => {
  res.status(StatusCodes.OK).send(db.posts);
});

//TODO: GET POST BY ID
postsRouter.get("/:id", (req, res: Response<PostViewModel>) => {
  const foundPost = postsRepository.findPostById(req.params.id);
  if (!foundPost) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.status(StatusCodes.OK).send(foundPost);
  }
});

//TODO: CREATE A NEW POST
postsRouter.post(
  "/",
  stringsInputValidator("title", 30),
  stringsInputValidator("shortDescription", 100),
  stringsInputValidator("content", 1000),
  body("blogId").custom(isValidBlogId),
  inputValidationMiddleware,
  (
    req: RequestBodyModel<PostInputModel>,
    res: Response<PostViewModel | TApiErrorResultObject>
  ) => {
    res.set({
      "Content-Type": "application/json",
      Accept: "application/json",
    });
    const newPost = postsRepository.createNewPost(req.body);
    res.status(StatusCodes.CREATED).send(newPost);
  }
);

//TODO: UPDATE POST BY ID
postsRouter.put(
  "/:id",
  stringsInputValidator("title", 30),
  stringsInputValidator("shortDescription", 100),
  stringsInputValidator("content", 1000),
  body("blogId").custom(isValidBlogId),
  inputValidationMiddleware,
  (
    req: RequestWithURIParamsAndBody<URIParamsRequest, PostInputModel>,
    res: Response<TApiErrorResultObject>
  ) => {
    const isUpdated = postsRepository.updatePostById(req.params.id, req.body);
    if (!isUpdated) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      res.sendStatus(StatusCodes.NO_CONTENT);
    }
  }
);

//TODO: DELETE POST BY ID
postsRouter.delete(
  "/:id",
  (req: RequestWithURIParam<URIParamsRequest>, res: Response) => {
    const isDeleted = postsRepository.deletePostById(req.params.id);

    if (!isDeleted) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      res.sendStatus(StatusCodes.NO_CONTENT);
    }
  }
);
