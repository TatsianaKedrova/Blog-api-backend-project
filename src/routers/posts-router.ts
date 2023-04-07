import express, { Response } from "express";
import { PostInputModel, PostViewModel } from "../dto/postsDTO/PostViewModel";
import { StatusCodes } from "http-status-codes";
import { db } from "../temporal-database/project-db";
import { postsRepository } from "../repositories/posts-repository";
import { responseErrorFunction } from "../utils/common-utils/responseErrorUtils";
import {
  TApiErrorResultObject,
  TFieldError,
} from "../dto/common/ErrorResponseModel";
import {
  RequestBodyModel,
  RequestWithURIParam,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
export const postsRouter = express.Router({});

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
  (
    req: RequestBodyModel<PostInputModel>,
    res: Response<PostViewModel | TApiErrorResultObject>
  ) => {
    const errors: TFieldError[] = [];
    const newPost = postsRepository.createNewPost(req.body);
    if (errors.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).send(responseErrorFunction(errors));
    } else {
      res.status(StatusCodes.CREATED).send(newPost);
    }
  }
);

//TODO: UPDATE POST BY ID
postsRouter.put(
  "/:id",
  (
    req: RequestWithURIParamsAndBody<URIParamsRequest, PostInputModel>,
    res: Response<TApiErrorResultObject>
  ) => {
    const errors: TFieldError[] = [];

    //validation
    res.status(StatusCodes.BAD_REQUEST).send(responseErrorFunction(errors));

    //401 unauthorized
    res.sendStatus(StatusCodes.UNAUTHORIZED);

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

    //401 unauthorized
    res.sendStatus(StatusCodes.UNAUTHORIZED);

    if (!isDeleted) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    } else {
      res.status(StatusCodes.NO_CONTENT);
    }
  }
);
