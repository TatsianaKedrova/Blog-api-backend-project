import { Request, Response } from "express";
import { BlogInputModel, BlogViewModel } from "../dto/blogsDTO/BlogViewModel";
import { StatusCodes } from "http-status-codes";
import { db } from "../temporal-database/project-db";
import {
  RequestBodyModel,
  RequestWithURIParam,
  RequestWithURIParamsAndBody,
} from "../dto/common/RequestModels";
import { URIParamsRequest } from "../dto/common/URIParamsRequest";
import { blogsRepository } from "../repositories/blogs-repository";
import { TApiErrorResultObject } from "../dto/common/ErrorResponseModel";

// @desc Get all blogs
// @route GET /api/blogs
// @access Public
export const getBlogs = (req: Request, res: Response<BlogViewModel[]>) => {
  res.status(StatusCodes.OK).send(db.blogs);
};

// @desc Get blog by ID
// @route GET /api/blogs/:id
// @access Public
export const getBlogsById = (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response<BlogViewModel>
) => {
  const foundBlog = blogsRepository.findBlogById(req.params.id);
  if (!foundBlog) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  } else {
    res.status(StatusCodes.OK).send(foundBlog);
  }
};

// @desc Create new blog
// @route POST /api/blogs
// @access Private
export const createNewBlog = (
  req: RequestBodyModel<BlogInputModel>,
  res: Response<BlogViewModel | TApiErrorResultObject>
) => {
  const newBlog = blogsRepository.createNewBlog(req.body);
  res.status(StatusCodes.CREATED).send(newBlog);
};

// @desc Update blog by ID
// @route PUT /api/blogs/:id
// @access Private
export const updateBlogById = (
  req: RequestWithURIParamsAndBody<URIParamsRequest, BlogInputModel>,
  res: Response<TApiErrorResultObject>
) => {
  const updatedBlog = blogsRepository.updateBlogById(req.params.id, req.body);
  if (!updatedBlog) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  }

  res.sendStatus(StatusCodes.NO_CONTENT);
};

// @desc Delete blog by ID
// @route DELETE /api/blogs/:id
// @access Private
export const deleteBlogById = (
  req: RequestWithURIParam<URIParamsRequest>,
  res: Response
) => {
  const foundBlog = blogsRepository.deleteBlogById(req.params.id);
  if (!foundBlog) {
    res.sendStatus(StatusCodes.NOT_FOUND);
  }
  res.sendStatus(StatusCodes.NO_CONTENT);
};
