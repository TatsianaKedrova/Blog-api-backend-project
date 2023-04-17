import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PostInputModel, PostViewModel } from "../dto/postsDTO/PostViewModel";
import { db } from "../temporal-database/project-db";
import { postsRepository } from "../repositories/posts-repository";
import {
  RequestBodyModel,
  RequestWithURIParam,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
import { TApiErrorResultObject } from "../dto/common/ErrorResponseModel";

// @desc Get all posts
// @route GET /api/posts
// @access Public
export const getPosts = (req: Request, res: Response<PostViewModel[]>) => {
  res.status(StatusCodes.OK).send(db.posts);
};

// @desc Get post by ID
// @route GET /api/posts/:id
// @access Public
export const getPostsById = (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response<PostViewModel>
) => {
  const foundPost = postsRepository.findPostById(req.params.id);
  if (!foundPost) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.status(StatusCodes.OK).send(foundPost);
  }
};

// @desc Create new post
// @route POST /api/posts
// @access Private
export const createNewPost = (
  req: RequestBodyModel<PostInputModel>,
  res: Response<PostViewModel | TApiErrorResultObject>
) => {
  const newPost = postsRepository.createNewPost(req.body);
  res.status(StatusCodes.CREATED).send(newPost);
};

// @desc Update a post
// @route PUT /api/posts/:id
// @access Private
export const updatePostById = (
  req: RequestWithURIParamsAndBody<URIParamsRequest, PostInputModel>,
  res: Response<TApiErrorResultObject>
) => {
  const isUpdated = postsRepository.updatePostById(req.params.id, req.body);
  if (!isUpdated) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
};

// @desc Delete post by ID
// @route DELETE /api/posts/:id
// @access Private
export const deletePostById = (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response
) => {
  const isDeleted = postsRepository.deletePostById(req.params.id);

  if (!isDeleted) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.sendStatus(StatusCodes.NO_CONTENT);
  }
};
