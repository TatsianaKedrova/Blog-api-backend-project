import express, { Response } from "express";
import { PostViewModel } from "../dto/postsDTO/PostViewModel";
import { StatusCodes } from "http-status-codes";
import { db } from "../temporal-database/project-db";
import { postsRepository } from "../repositories/posts-repository";
import { responseErrorFunction } from "../utils/common-utils/responseErrorUtils";
import { TFieldError } from "../dto/common/ErrorResponseModel";
export const postsRouter = express.Router({});

postsRouter.get("/", (req, res: Response<PostViewModel[]>) => {
  res.status(StatusCodes.OK).send(db.posts);
});

postsRouter.get("/:id", (req, res: Response<PostViewModel>) => {
  const foundPost = postsRepository.findPostById(req.params.id);
  if (!foundPost) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.status(StatusCodes.OK).send(foundPost);
  }
});

postsRouter.post("/", (req, res: Response<PostViewModel>) => {
    const errors: TFieldError[] = [];
  const newPost = postsRepository.createNewPost(req.body);
//   if(newPost) {
//     res.status(StatusCodes.BAD_REQUEST).send(responseErrorFunction(errors))
//   }
//   res.status(StatusCodes.CREATED).send(newPost);
});
