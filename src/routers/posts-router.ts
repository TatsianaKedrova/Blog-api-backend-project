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
import { postsValidator } from "../utils/postsValidator/postsValidator";
import { responseErrorValidationMiddleware } from "../middlewares/responseErrorValidationMiddleware";

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
  basicAuthMiddleware,
  postsValidator,
  responseErrorValidationMiddleware,
  (
    req: RequestBodyModel<PostInputModel>,
    res: Response<PostViewModel | TApiErrorResultObject>
  ) => {
    const newPost = postsRepository.createNewPost(req.body);
    res.status(StatusCodes.CREATED).send(newPost);
  }
);

//TODO: UPDATE POST BY ID
postsRouter.put(
  "/:id",
  basicAuthMiddleware,
  postsValidator,
  responseErrorValidationMiddleware,
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
  basicAuthMiddleware,
  (req: RequestWithURIParam<URIParamsRequest>, res: Response) => {
    const isDeleted = postsRepository.deletePostById(req.params.id);

    if (!isDeleted) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      res.sendStatus(StatusCodes.NO_CONTENT);
    }
  }
);
